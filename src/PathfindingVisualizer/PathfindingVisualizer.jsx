import React, {Component} from 'react';
import Node from './Node/Node';
//import {dijkstra, getNodesInShortestPathOrder} from '../algorithms/dijkstra';
import {bellmanford, getNodesInShortestPathOrder} from '../algorithms/bellmanford'
import './PathfindingVisualizer.css';
import { render } from '@testing-library/react';

const START_NODE_ROW = 10;
const START_NODE_COL = 15;
const FINISH_NODE_ROW = 10;
const FINISH_NODE_COL = 35;


export default class PathfindingVisualizer extends Component {
  constructor() {
    super();
    this.state = {
      grid: [],
      mouseIsPressed: false,
      Grid_Empty: true,
      CLICK_TYPE: "Wall",
      NegsUsed: false, 
      Algo: "BELLMANFORD"
    };
  }

  componentDidMount() {
    const grid = getInitialGrid();
    this.setState({grid});
  }

  handleMouseDown(row, col) {
    if(this.state.CLICK_TYPE == "Wall"){
      this.setState({grid: getNewGridWithWallToggled(this.state.grid, row, col), Grid_Empty: false, mouseIsPressed: true});
    }else{
      this.setState({grid: getNewGridWithNegativeToggled(this.state.grid, row, col), Grid_Empty: false, mouseIsPressed: true, NegsUsed: true});
    }
  }

  handleMouseEnter(row, col) {
    if (!this.state.mouseIsPressed) return;
    if(this.state.CLICK_TYPE == "Wall"){
      this.setState({grid: getNewGridWithWallToggled(this.state.grid, row, col), Grid_Empty: false});
    }else{
      this.setState({NegsUsed: true, grid: getNewGridWithNegativeToggled(this.state.grid, row, col), Grid_Empty: false});
    }
  }

  handleMouseUp() {
    this.setState({mouseIsPressed: false});
  }

  animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder) {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      if (i === visitedNodesInOrder.length) {
        setTimeout(() => {
          this.animateShortestPath(nodesInShortestPathOrder);
        }, 10 * i);
        return;
      }
      setTimeout(() => {
        const node = visitedNodesInOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-visited';
      }, 5 * i);
    }
  }

  clearWalls() {
    this.setState({grid: getInitialGrid()});
  }

  setNeg() {
    this.setState({CLICK_TYPE: "Neg"});
  }

  setWall() {
    this.setState({CLICK_TYPE: "Wall"});
  }

  animateShortestPath(nodesInShortestPathOrder) {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          'node node-shortest-path';
      }, 25 * i);
    }
  }

  visualize() {
    const {grid} = this.state;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = bellmanford(grid, startNode, finishNode);
    this.setState({ALGO_DONE: true});
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
    this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder);
  }




  clearPath(){
    const {grid} = this.state;
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[0].length; col++){
          if ((col == START_NODE_COL)&&(row == START_NODE_ROW)){
            document.getElementById(`node-${row}-${col}`).className ='node node-start';  
          } else if((col == FINISH_NODE_COL)&&(row == FINISH_NODE_ROW)){
            document.getElementById(`node-${row}-${col}`).className = 'node node-finish';
          }else{
            document.getElementById(`node-${row}-${col}`).className = 'node';
          }
      }
    }
    this.setState({NegsUsed: false, grid: getInitialGrid()});
  }

  render() {
    const {grid, mouseIsPressed, Grid_Empty, CLICK_TYPE, NegsUsed} = this.state;

    return (
      <>

        <button disabled = {CLICK_TYPE == "Wall"} onClick={ () => this.setWall()}>
          Toggle Walls
        </button>

        <button disabled = {CLICK_TYPE == "Neg"} onClick={() => this.setNeg()}>
          Toggle Negative Weights
        </button>

        <button onClick={() => this.visualizeDijkstra()}>
          Visualize Dijkstra's Algorithm
        </button>
        
        <button disabled = {Grid_Empty} onClick = {() => this.clearPath()}>
          Clear All
        </button>
        
        <div className="grid">
          {grid.map((row, rowIdx) => {
            return (
              <div key={rowIdx}>
                {row.map((node, nodeIdx) => {
                  const {row, col, isFinish, isStart, isWall, extraClassName, weight} = node;
                  return (
                    <Node
                      key={nodeIdx}
                      col={col}
                      isFinish={isFinish}
                      isStart={isStart}
                      isWall={isWall}
                      weight = {weight}
                      extraClassName = {extraClassName}
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

const getInitialGrid = () => {
  const grid = [];
  for (let row = 0; row < 20; row++) {
    const currentRow = [];
    for (let col = 0; col < 50; col++) {
      currentRow.push(createNode(col, row));
    }
    grid.push(currentRow);
  }
  return grid;
};

const createNode = (col, row) => {

  return {
    col,
    row,
    isStart: row === START_NODE_ROW && col === START_NODE_COL,
    isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
    distance: Infinity,
    isVisited: false,
    isWall: false,
    previousNode: null,
    weight: 1
  };
};


const getNewGridWithWallToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    isWall: !node.isWall,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};

const getNewGridWithNegativeToggled = (grid, row, col) => {
  const newGrid = grid.slice();
  const node = newGrid[row][col];
  const newNode = {
    ...node,
    weight: node.weight*-1,
  };
  newGrid[row][col] = newNode;
  return newGrid;
};




