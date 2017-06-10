class Dijkstra {
  constructor(nodeList) {
    this.nodeList = nodeList;
    this.visited = [];
    this.unvisited = [];
  }

  initiate(source) {
    source.weight = 0;
    source.cost = 0;
    this.unvisited.push(source);
    Object.keys(this.nodeList).forEach(id => {
      let node = this.nodeList[id];
      if (node !== source) {
        node.cost = Infinity;
        this.unvisited.push(node);
      }
    });
  }

  search(source, destination) {
    this.initiate(this.nodeList[source])
    let parent = {};
    let node = this.nodeList[source];
    while (this.unvisited.length !== 0) {
      node.children.sort((a,b) => a.weight - b.weight).forEach(child => {
        let neighbor;
        if (this.unvisited.indexOf(this.nodeList[child.id]) !== -1) {
          neighbor = this.nodeList[child.id];
          if (neighbor.cost > node.cost + child.weight) {
            neighbor.cost = node.cost + child.weight;
            parent[neighbor.id] = node.id;
          }
        }
      });
      // adds node to visited list
      this.visited.push(node);
      // remove node from unvisited list
      this.unvisited.splice(this.unvisited.indexOf(node), 1);

      //choose node with lowest cost
      node = this.unvisited[0];
      for (let i = 1; i < this.unvisited.length; i++) {
        if (this.unvisited[i].cost < node.cost) {
          node = this.unvisited[i];
        }
      }
    }
    // create path from source to destination
    this.createPath(parent, this.nodeList[source], this.nodeList[destination]);
  }

  createPath(parent, source, destination) {
    let path = [destination.id];
    let startKey = destination.id;
    while (parent[startKey]) {
      path.push(parent[startKey]);
      startKey = parent[startKey];
    }
    return path.reverse();
  }
}
