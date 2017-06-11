import Astar from './astar';
import { merge } from 'lodash';
import Visualization from '../d3/visualization';

class AstarStep extends Astar {
  constructor(nodeList, startNodeId, endNodeId, visual) {
    super(nodeList);
    this.visualization = visual;
    this.i = 0;
    this.steps = this.search(startNodeId, endNodeId);
    this.nextStep = 'highlight node';
  }

  search(startNodeId, endNodeId) {
    let list = merge({}, this.nodeList);
    let endNode = list[endNodeId];
    let startNode = list[startNodeId];

    for (let idx in list) {
      list[idx].f = 0;
      list[idx].g = 0;
      list[idx].h = 0;
      list[idx].parent = undefined;
    }

    startNode.f = this.hcost(startNode, endNode);
    startNode.h = this.hcost(startNode, endNode);
    let steps = [];
    this.openList.push(startNode);

    let newStep = {
      currentNode: startNode,
      openList: [],
      closeList: [],
      path: []
    }
    steps.push(newStep);

    while (this.openList.length > 0) {
      let lowIdx = 0;

      for (var i = 0; i < this.openList.length; i++) {
        if (this.openList[i].f < this.openList[lowIdx].f) { lowIdx = i }
      }
      let currentNode = this.openList[lowIdx];

      let closeList = [];
      let openList = [];
      this.openList.forEach( node => openList.push(node));
      this.closeList.push(this.openList.splice(lowIdx, 1)[0]);
      this.closeList.forEach( node => closeList.push(node));

      if (currentNode.id === endNode.id) {
        let newPath = [];
        let curr = currentNode;
        while (curr.parent) {
          newPath.push([curr.parent.id, curr.id]);
          curr = curr.parent;
        }

        let newNode = merge({}, currentNode);
        let newStep = {
          currentNode: newNode,
          openList: openList,
          closeList: closeList,
          path: newPath.reverse()
        }
        steps.push(newStep);
        return steps;
      }

      currentNode.children.forEach( node => {
        list[node.id].weight = node.weight;
      });

      this.childNodes(currentNode).forEach( node => {
        let gScore = currentNode.g + node.weight;
        if (!this.openList.includes(node)) {
          this.openList.push(node);
          list[node.id].parent = currentNode;
          list[node.id].g = gScore;
          list[node.id].h = this.hcost(list[node.id], list[endNodeId]);
          list[node.id].f = list[node.id].g + list[node.id].h;

        } else if (gScore < list[node.id].g) {
          list[node.id].parent = currentNode;
          list[node.id].g = gScore;
          list[node.id].h = this.hcost(list[node.id], list[endNodeId]);
          list[node.id].f = list[node.id].g + list[node.id].h;
        }
        let newPath = [];
        let curr = node;
        while (curr.parent) {
          newPath.push([curr.parent.id, curr.id]);
          curr = curr.parent;
        }

        let newNode = merge({}, list[node.id]);
        let newStep = {
          currentNode: currentNode,
          childNode: newNode,
          closeList: closeList,
          openList: openList,
          path: newPath.reverse()
        }
        steps.push(newStep);
      });
    }
    return steps;
  }

  stepForward() {
    if (this.i >= this.steps.length) return;
    let node = this.steps[this.i];
    let curr = node.currentNode;
    let child = node.childNode;
    let visual = this.visualization;

    visual.clearLinks();
    visual.clearNodes();
    if (child) {
      visual.highlightNode(child.id, "yellow")
      visual.removeText(child.id);
      visual.addText(child.id, -19, -55, 'blue', (d) => `h = ${Math.floor(child.h)}`);
      visual.addText(child.id, -19, -41, 'blue', (d) => `g = ${Math.floor(child.g)}`);
      visual.addText(child.id, -19, -25, 'blue', (d) => `f = ${Math.floor(child.f)}`);
      visual.highlightLink(child.parent.id, child.id, "red");
    }

    visual.removeText(curr.id);
    visual.addText(curr.id, -19, -55, 'blue', (d) => `h = ${Math.floor(curr.h)}`);
    visual.addText(curr.id, -19, -41, 'blue', (d) => `g = ${Math.floor(curr.g)}`);
    visual.addText(curr.id, -19, -25, 'blue', (d) => `f = ${Math.floor(curr.f)}`);

    if (this.i === this.steps.length - 1) {
      node.path.forEach( link => {
        visual.highlightLink(link[0], link[1], "blue");
        visual.highlightNode(link[0], "red");
      });
    } else {
      node.path.forEach( link => {
        visual.highlightLink(link[0], link[1], "red");
      });
    }
    visual.highlightNode(curr.id, 'green');
    this.i += 1;
  }

  stepBackward() {
    let visual = this.visualization;
    if (this.i <= 1) {
      if (this.i === 0) {
        return;
      } else {
        let node = this.steps[this.i - 1];
        visual.unhighlightNode(node.currentNode.id);
        this.i -= 1;
        return;
      }
    };
    this.i -= 1
    let node = this.steps[this.i - 1];
    let curr = node.currentNode;
    let child = node.childNode;

    visual.clearLinks();
    visual.clearNodes();
    if (this.i === this.steps.length - 1) {
      node.path.forEach( link => {
        visual.highlightLink(link[0], link[1], "red");
      })
    }
    if (child) {
      visual.highlightNode(child.id, "yellow")
      visual.removeText(child.id);
      visual.addText(child.id, -19, -55, 'blue', (d) => `h = ${Math.floor(child.h)}`);
      visual.addText(child.id, -19, -41, 'blue', (d) => `g = ${Math.floor(child.g)}`);
      visual.addText(child.id, -19, -25, 'blue', (d) => `f = ${Math.floor(child.f)}`);
      visual.highlightLink(child.parent.id, child.id, "red");
    }
    node.path.forEach( link => {
      visual.highlightLink(link[0], link[1], "red");
    });
    visual.highlightNode(curr.id, 'green');
  }

  stepForwardDisplay() {
    if (this.i >= this.steps.length) return;
    let node = this.steps[this.i];
    let curr = node.currentNode;
    let child = node.childNode;
    let visual = this.visualization;

    visual.clearLinks();
    visual.clearNodes();
    if (child) {
      visual.highlightNode(child.id, "yellow")
      visual.highlightLink(child.parent.id, child.id, "red");
    }
    if (this.i === this.steps.length - 1) {
      node.path.forEach( link => {
        visual.highlightLink(link[0], link[1], "blue");
        visual.highlightNode(link[0], "red");
      });
    } else {
      node.path.forEach( link => {
        visual.highlightLink(link[0], link[1], "red");
      });
    }
    visual.highlightNode(curr.id, 'green');
    this.i += 1;
    if (this.i === this.steps.length) {
      this.i = 0;
    }
  }

  display() {
    setInterval(() => this.stepForwardDisplay(), 1500);
  }
}

export default AstarStep;
