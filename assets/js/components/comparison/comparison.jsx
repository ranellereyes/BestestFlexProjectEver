import React from 'react';
import Highlight from 'react-highlight';
import Visualization from '../../d3/visualization';
import { NODELIST } from '../../algorithms/node';

import DijkstraSteps from '../../algorithms/dijkstra_steps';
import AstarSteps from '../../algorithms/astar_step';
import BellmanFordSteps from '../../algorithms/bellman_ford_steps';
import FloydWarshallAlgoSteps from '../../algorithms/floyd-warshall-algo-steps';

class Comparison extends React.Component {
  constructor(props) {
    super(props);
    this.state = { options:
                    { optionA: "dijkstra",
                      optionB: "bellman-ford"
                    }
                  };

    // this.fetchCode('static/javascript/bellman_ford.js');
    this.initAlgorithms = this.initAlgorithms.bind(this);
    this.fetchCode = this.fetchCode.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.handleClickLeft = this.handleClickLeft.bind(this);
    this.handleClickRight = this.handleClickRight.bind(this);
    this.handleSelectA = this.handleSelectA.bind(this);
    this.handleSelectB = this.handleSelectB.bind(this);

  }

  componentDidMount() {
    document.onkeydown = this.handleKeyPress;
    document.onkeyup = this.handleKeyUp;
    let visualA = new Visualization(NODELIST, "comp-visualization-a");
    let visualB = new Visualization(NODELIST, "comp-visualization-b");
    visualA.draw();
    window.v = visualA;
    this.setState({ graph: visualA});
    // this.initAlgorithms(visualA);
  }

  componentWillUnmount() {
    document.onkeydown = null;
    document.onkeyup = null;
  }

  initAlgorithms(visual) {
    this.algorithms = [new DijkstraSteps(NODELIST, 1, 6, visual),
                      new AstarSteps(NODELIST, 1, 6, visual),
                      new BellmanFordSteps(NODELIST, 1, 6, visual),
                      new FloydWarshallAlgoSteps(NODELIST, 1, 6, visual)];
  }

  fetchCode(file) {
    var f = new XMLHttpRequest();
    f.open("GET", file, false);
    f.onreadystatechange = () => {
      if(f.readyState === 4) {
        if(f.status === 200 || f.status == 0) {
          this.codeA = f.responseText;
        }
      }
    };
    f.send(null);
  }

  handleKeyPress (e) {
    if (e.keyCode === 37){
      this.handleClickLeft(e);
      document.getElementById("arrow_left").style.backgroundImage = "url('/static/images/arrow_blue.png')";
    } else if (e.keyCode === 39){
      this.handleClickRight(e);
      document.getElementById("arrow_right").style.backgroundImage = "url('/static/images/arrow_blue.png')";
    }
  }
  handleKeyUp (e) {
    document.getElementById("arrow_left").style.backgroundImage = "url('/static/images/arrow_gray.png')";
    document.getElementById("arrow_right").style.backgroundImage = "url('/static/images/arrow_gray.png')";
  }

  handleClickLeft(e) {
    // this.handleKeyPress({keyCode:  37});
    this.algorithms.forEach((algo) => {
      algo.stepBackward();
    });
  }

  handleClickRight(e) {
    // this.handleKeyPress({keyCode:  39});
    this.algorithms.forEach((algo) => {
      algo.stepForward();
    });
  }

  handleSelectA (e) {
   this.setState({options: {optionA: e.target.value}});
   this.initAlgorithms();
  }

  handleSelectB (e) {
   this.setState({options: {optionB: e.target.value}});
   this.initAlgorithms();
  }

  render() {
    return (
      <div className="index-main">
        <main className="comp-main">
          <section className="comp-main">
            <ul className="comp-visualization">
              <li>
                <select onChange={this.handleSelectA} value={this.state.options.optionA}>
                  <option value="dijkstra">Dijkstra</option>
                  <option value="astar">A* Algorithm</option>
                  <option value="bellman-ford">Bellman-Ford</option>
                  <option value="floyd-warshall">Floyd-Warshall</option>
                </select>
                <div className="comp-visualization-a" />
              </li>
              <li>
                <select onChange={this.handleSelectB} value={this.state.options.optionB}>
                  <option value="dijkstra">Dijkstra</option>
                  <option value="astar">A* Algorithm</option>
                  <option value="bellman-ford">Bellman-Ford</option>
                  <option value="floyd-warshall">Floyd-Warshall</option>
                </select>
                <div className="comp-visualization-b" />
              </li>
            </ul>
          </section>
          <section className="comp-arrows">
            <figure onClick={this.handleClickLeft} id="arrow_left"></figure>
            <figure onClick={this.handleClickRight} id="arrow_right"></figure>
          </section>
          <section className="comp-graph">
            <ul>
              <li className="comp-graph-code">
                <Highlight class="javascript-snippet">

                </Highlight>
              </li>
              <li className="comp-graph">
                Graph area
              </li>
              <li className="comp-graph-code">
                <Highlight class="javascript-snippet">

                </Highlight>
              </li>
            </ul>
          </section>

        </main>
      </div>
    );
  }
}

export default Comparison;
