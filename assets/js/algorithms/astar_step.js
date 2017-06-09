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

    while (this.openList.length > 0) {
      let lowIdx = 0;

      for (var i = 0; i < this.openList.length; i++) {
        if (this.openList[i].f < this.openList[lowIdx].f) { lowIdx = i }
      }
      let currentNode = this.openList[lowIdx];

      let newPath = [];
      let solution = [];
      let curr = currentNode;
      while (curr.parent) {
        newPath.push([curr.parent.id, curr.id]);
        solution.push(curr.id);
        curr = curr.parent;
      }

      let openList = [];
      this.openList.forEach( node => openList.push(node.id));
      this.closeList.push(this.openList.splice(lowIdx, 1)[0]);

      let newNode = merge({}, currentNode);
      let newStep = {
        currentNode: newNode,
        openList: openList,
        path: newPath.reverse()
      }
      steps.push(newStep);

      if (currentNode.id === endNode.id) return steps;

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
      });
    }
    return steps;
  }

  stepForward() {
    if (this.i >= this.steps.length) return;
    let node = this.steps[this.i];
    let curr = node.currentNode;
    let visual = this.visualization;
    visual.highlightNode(curr.id, "green");
    visual.removeText(curr.id);
    visual.addText(curr.id, -19, -55, 'blue', (d) => `h = ${Math.floor(curr.h)}`);
    visual.addText(curr.id, -19, -41, 'blue', (d) => `g = ${Math.floor(curr.g)}`);
    visual.addText(curr.id, -19, -25, 'blue', (d) => `f = ${Math.floor(curr.f)}`);
    if (curr.parent) {
        visual.highlightNode(curr.parent.id, "red");
      visual.highlightLink(curr.parent.id, curr.id, "red");
    }
    if (this.i === this.steps.length - 1) {
      node.path.forEach( link => {
        visual.highlightLink(link[0], link[1], "blue");
      });
    }
    this.i += 1;
  }

  stepBackward() {
    if (this.i <= 0) return;
    this.i -= 1;
    let node = this.steps[this.i];
    let curr = node.currentNode;
    let visual = this.visualization;
    if (this.i === this.steps.length - 1) {
      node.path.forEach( link => {
        visual.highlightLink(link[0], link[1], "red");
      })
    }
    visual.unhighlightNode(curr.id);
    visual.removeText(curr.id);
    if (curr.parent) {
      if (this.steps[this.i - 1].openList.includes(curr.parent.id)) {
        visual.highlightNode(curr.parent.id, "green");
      }
      visual.removeText(curr.parent.id);
      visual.addText(curr.parent.id, -19, -55, 'blue', (d) => `h = ${Math.floor(curr.parent.h)}`);
      visual.addText(curr.parent.id, -19, -41, 'blue', (d) => `g = ${Math.floor(curr.parent.g)}`);
      visual.addText(curr.parent.id, -19, -25, 'blue', (d) => `f = ${Math.floor(curr.parent.f)}`);
      visual.unhighlightLink(curr.parent.id, curr.id);
    }
  }
}

export default AstarStep;
