import React, {Component} from 'react';
import Node from './Node/Node';
import {dijkstra, getNodesInShortestPathOrder} from '../algorithms/dijkstra';

import './PathfindingVisualizer.css';

const START_NODE_ROW = 10;
const START_NODE_COL = 25;
const FINISH_NODE_ROW = 19;
const FINISH_NODE_COL = 49;

export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      selectValue: "No Wind",
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const grid = getInitialGrid(this.state.selectValue);
    this.setState({grid});
  }

  handleMouseDown(row, col) {
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid, mouseIsPressed: true});
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    const newGrid = getNewGridWithWallToggled(this.state.grid, row, col);
    this.setState({grid: newGrid});
  }

  handleMouseUp() {
    this.setState({mouseIsPressed: false});
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder, wind) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          // this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 10 * i);
    }
  }



  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 50 * i);
    }
  }

  visualizeDijkstra() {
    const {grid} = this.state;
    const wind = this.state.selectValue;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = dijkstra(grid, startNode, finishNode);
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder, wind);
  }

  handleChange(e){
    this.setState({selectValue:e.target.value});
  }

  render() {
    const {grid, mouseIsPressed} = this.state;
    var message='You selected '+this.state.selectValue;

    return (
      <>
        <button onClick={() => this.visualizeDijkstra()}>
          Visualize Forest Fire Spread
        </button>

        <select 
        value={this.state.selectValue} 
        onChange={this.handleChange} 
      >
        <option value="No Wind">No Wind</option>
        <option value="N">N</option>
        <option value="E">E</option>
        <option value="W">W</option>
        <option value="S">S</option>
        <option value="NE">NE</option>
        <option value="NW">NW</option>
        <option value="SE">SE</option>
        <option value="SW">SW</option>
      </select>

      <p>{message}</p>

        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const {row, col, isFinish, isStart, isWall, weight} = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      weight = {weight}
                      mouseIsPressed={mouseIsPressed}
                      onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                      onMouseEnter={(row, col) =>
                        this.handleMouseEnter(row, col)
                      }
                      onMouseUp={() => this.handleMouseUp()}
                      row={row}></Node>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }
}

const getInitialGrid = (wind) => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(col, row, wind));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row, wind) => {
  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    weight: getWeight(col, row, wind),
    previousNode: null,
  };
};

const getWeight = (col, row, wind) => {
  if (wind === 'N'){
    if(row < START_NODE_ROW){
      return Math.floor(Math.random() * 100 * 0.5)
    }    
  }
  if (wind === 'S'){
    if(row > START_NODE_ROW){
      return Math.floor(Math.random() * 100 * 0.5)
    }    
  }
  if (wind === 'E'){
    if(col > START_NODE_COL){
      return Math.floor(Math.random() * 100 * 0.5)
    }    
  }
  if (wind === 'W'){
    if(col < START_NODE_COL){
      return Math.floor(Math.random() * 100 * 0.5)
    }    
  }
  if (wind === 'NE'){
    if(row < START_NODE_ROW && col > START_NODE_COL){
      return Math.floor(Math.random() * 100 * 0.5)
    }    
  }
  if (wind === 'SE'){
    if(row > START_NODE_ROW && col > START_NODE_COL){
      return Math.floor(Math.random() * 100 * 0.5)
    }    
  }
  if (wind === 'NW'){
    if(row < START_NODE_ROW && col < START_NODE_COL){
      return Math.floor(Math.random() * 100 * 0.5)
    }    
  }
  if (wind === 'SW'){
    if(row > START_NODE_ROW && col < START_NODE_COL){
      return Math.floor(Math.random() * 100 * 0.5)
    }    
  }
  return Math.floor(Math.random() * 100)
};

const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    
  };
  newGrid[row][col] = newNode;
  return newGrid;
};
