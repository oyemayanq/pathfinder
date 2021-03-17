import "../styles/main.css";
import React, { Component } from "react";

import Node from "./Node";
import { dijkstra, getNodesinPath } from "../algorithms/dijkstra";
import { bfs } from "../algorithms/bfs";
import { dfs } from "../algorithms/dfs";

class Main extends Component {
  constructor() {
    super();
    this.row = 40;
    this.col = 18;
    this.state = {
      grid: [],
      startRow: 5,
      startCol: 5,
      endRow: 15,
      endCol: 15,
      isMousePressed: false,
      isStartNode: false,
      isEndNode: false,
      isDropDownActive: false,
      algorithm: "",
      isRunning: false,
    };
  }

  componentDidMount() {
    this.createGrid();
  }

  /// Creating grid-------------------------------------------------------------->

  createNode = (row, col) => {
    return {
      row,
      col,
      isStart: row === this.state.startRow && col === this.state.startCol,
      isEnd: row === this.state.endRow && col === this.state.endCol,
      isWall: false,
      isVisited: false,
      distance: Infinity,
      prevNode: null,
    };
  };

  createGrid = () => {
    const r = this.row;
    const c = this.col;
    const newGrid = [];
    for (let i = 0; i < r; i++) {
      const rowLine = [];
      for (let j = 0; j < c; j++) {
        rowLine.push(this.createNode(i, j));
      }
      newGrid.push(rowLine);
    }
    this.setState({ grid: newGrid });
  };

  /// Rendering grid ------------------------------------------------------------>

  renderGrid = () => {
    const newGrid = this.state.grid.map((row, rowIdx) => {
      return (
        <div className="gridRow" key={rowIdx}>
          {row.map((node, nodeIdx) => {
            return (
              <Node
                key={nodeIdx}
                row={node.row}
                col={node.col}
                isStart={node.isStart}
                isEnd={node.isEnd}
                isWall={node.isWall}
                onMouseDown={this.handleMouseDown}
                onMouseUp={this.handleMouseUp}
                onMouseEnter={this.handleMouseEnter}
              />
            );
          })}
        </div>
      );
    });

    return newGrid;
  };

  /// Handling mouse events ----------------------------------------------------->

  makeWall = (row, col) => {
    if (this.state.grid[row][col].isStart || this.state.grid[row][col].isEnd)
      return;
    const newGrid = this.state.grid;
    newGrid[row][col].isWall = !newGrid[row][col].isWall;
    this.setState({ grid: newGrid });
  };

  handleMouseEnter = (row, col) => {
    if (!this.state.isMousePressed) return;
    if (this.state.isRunning) return;
    if (this.state.isStartNode) {
      const newGrid = this.state.grid;
      newGrid[row][col].isStart = true;
      newGrid[this.state.startRow][this.state.startCol].isStart = false;
      this.setState({ grid: newGrid, startRow: row, startCol: col });
    } else if (this.state.isEndNode) {
      const newGrid = this.state.grid;
      newGrid[row][col].isEnd = true;
      newGrid[this.state.endRow][this.state.endCol].isEnd = false;
      this.setState({ grid: newGrid, endRow: row, endCol: col });
    } else this.makeWall(row, col);
  };

  handleMouseDown = (row, col) => {
    if (this.state.isRunning) return;
    this.setState({ isMousePressed: true });
    if (this.state.grid[row][col].isStart) {
      this.setState({ isStartNode: true });
    } else if (this.state.grid[row][col].isEnd) {
      this.setState({ isEndNode: true });
    } else this.makeWall(row, col);
  };

  handleMouseUp = () => {
    this.setState({
      isMousePressed: false,
      isStartNode: false,
      isEndNode: false,
    });
  };

  /// Handling animations ------------------------------------------------------->

  animatePathNode = (pathNode) => {
    for (let i = 0; i < pathNode.length; i++) {
      setTimeout(() => {
        if (!pathNode[i].isStart && !pathNode[i].isEnd) {
          const row = pathNode[i].row;
          const col = pathNode[i].col;
          const node = document.getElementById(`node-${row}-${col}`);
          node.classList.add("path-node");
        }
      }, 50 * i);
    }
    setTimeout(() => {
      this.setState({ isRunning: false });
    }, 25 * pathNode.length);
  };

  animateGrid = (nodesVisited, pathNode) => {
    for (let i = 0; i <= nodesVisited.length; i++) {
      if (i === nodesVisited.length) {
        setTimeout(() => {
          this.animatePathNode(pathNode);
        }, 10 * i);
      } else {
        setTimeout(() => {
          if (!nodesVisited[i].isStart && !nodesVisited[i].isEnd) {
            const row = nodesVisited[i].row;
            const col = nodesVisited[i].col;
            const node = document.getElementById(`node-${row}-${col}`);
            node.classList.add("visited-node");
          }
        }, 10 * i);
      }
    }
  };

  animateGridWIth = (nodesVisited) => {
    for (let i = 0; i < nodesVisited.length; i++) {
      setTimeout(() => {
        if (!nodesVisited[i].isStart && !nodesVisited[i].isEnd) {
          const row = nodesVisited[i].row;
          const col = nodesVisited[i].col;
          const node = document.getElementById(`node-${row}-${col}`);
          node.classList.add("visited-node");
        }
      }, 10 * i);
    }
  };

  /// Handling Visualization ---------------------------------------------------->

  handleVisualization = () => {
    if (this.state.isRunning) return;
    if (this.state.algorithm.length === 0) {
      alert("Select an algorithm");
      return;
    }
    this.setState({ isRunning: true });
    const startRow = this.state.startRow;
    const startCol = this.state.startCol;
    const endRow = this.state.endRow;
    const endCol = this.state.endCol;
    let nodesVisited = [];
    switch (this.state.algorithm) {
      case "Dijkstra's":
        nodesVisited = dijkstra(
          this.state.grid,
          this.state.grid[startRow][startCol],
          this.state.grid[endRow][endCol]
        );
        break;
      case "BFS":
        nodesVisited = bfs(
          this.state.grid,
          this.state.grid[startRow][startCol],
          this.state.grid[endRow][endCol]
        );
        break;
      case "DFS":
        nodesVisited = dfs(
          this.state.grid,
          this.state.grid[startRow][startCol],
          this.state.grid[endRow][endCol]
        );
        break;
      default:
        return;
    }
    const pathNodes = getNodesinPath(this.state.grid[endRow][endCol]);
    this.animateGrid(nodesVisited, pathNodes);
  };

  /// Handling grid cleaning ---------------------------------------------------->

  clearGrid = () => {
    if (this.state.isRunning) return;
    const newGrid = this.state.grid;
    for (let i = 0; i < this.row; i++) {
      for (let j = 0; j < this.col; j++) {
        newGrid[i][j].isVisited = false;
        newGrid[i][j].distance = Infinity;
        newGrid[i][j].prevNode = null;
        const node = document.getElementById(`node-${i}-${j}`);
        node.classList.remove("visited-node");
        node.classList.remove("path-node");
      }
    }
    this.setState({ grid: newGrid });
  };

  clearWalls = () => {
    if (this.state.isRunning) return;
    const newGrid = this.state.grid;
    newGrid.forEach((row) => {
      row.forEach((node) => {
        node.isWall = false;
      });
    });
    this.setState({ grid: newGrid });
  };

  /// Utility methods ----------------------------------------------------------->

  handleAlgorithm = (alg) => {
    this.setState({ isDropDownActive: false, algorithm: alg });
  };

  handleDorpdownState = () => {
    if (this.state.isDropDownActive) {
      this.setState({ isDropDownActive: false });
    }
  };

  /// Render -------------------------------------------------------------------->
  render() {
    return (
      <div onClick={() => this.handleDorpdownState()}>
        <div className="main-nav">
          <div className="dropdown-wrapper">
            <h2
              onClick={() =>
                this.setState({
                  isDropDownActive: !this.state.isDropDownActive,
                })
              }
              className="main-title"
            >
              Algorithms
            </h2>
            <div
              className={`dropdown-content ${
                this.state.isDropDownActive ? "dropdown-active" : ""
              }`}
            >
              <h2
                onClick={() => this.handleAlgorithm("Dijkstra's")}
                className="dropdown-item"
              >
                Dijkstra's algorithm
              </h2>
              <h2
                onClick={() => this.handleAlgorithm("BFS")}
                className="dropdown-item"
              >
                BFS
              </h2>
              <h2
                onClick={() => this.handleAlgorithm("DFS")}
                className="dropdown-item"
              >
                DFS
              </h2>
            </div>
          </div>
        </div>
        <div className="button-container">
          <button
            onClick={this.handleVisualization}
          >{`Visualize ${this.state.algorithm}`}</button>
          <button onClick={this.clearGrid}>Clear Grid</button>
          <button onClick={this.clearWalls}>Clear Walls</button>
        </div>
        <div className="index-container">
          <div className="index-item">
            <div className="start-node-index"></div>
            <p>Start node</p>
          </div>
          <div className="index-item">
            <div className="end-node-index"></div>
            <p>End node</p>
          </div>
          <div className="index-item">
            <div className="wall-node-index"></div>
            <p>Wall node</p>
          </div>
          <div className="index-item">
            <div className="unvisited-node-index"></div>
            <p>Unvisited node</p>
          </div>
          <div className="index-item">
            <div className="visited-node-index"></div>
            <p>Visited node</p>
          </div>
          <div className="index-item">
            <div className="path-node-index"></div>
            <p>Path node</p>
          </div>
        </div>
        <div className="grid-container">{this.renderGrid()}</div>
        <div className="last-div">
          <h2>
            Made by <a href=""https://www.github.com/oyemayanq>Mayank</a>
          </h2>
        </div>
      </div>
    );
  }
}

export default Main;
