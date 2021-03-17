function getAllNodes(grid) {
  const nodeList = [];
  grid.forEach((row) => {
    row.forEach((node) => {
      nodeList.push(node);
    });
  });
  return nodeList;
}

function doSwap(nodeList, i, m) {
  const node = nodeList[i];
  nodeList[i] = nodeList[m];
  nodeList[m] = node;
}

function heapify(nodeList, i) {
  let m = i,
    n = nodeList.length;
  let l = 2 * i + 1;
  let r = 2 * i + 2;
  if (l < n && nodeList[i].distance > nodeList[l].distance) m = l;
  if (r < n && nodeList[m].distance > nodeList[r].distance) m = r;
  if (m !== i) {
    doSwap(nodeList, m, i);
    heapify(nodeList, m);
  }
}

function sortNodeList(nodeList) {
  for (let i = Math.floor(nodeList.length / 2) - 1; i >= 0; i--)
    heapify(nodeList, i);
}

function getUnvisitedNodes(grid, row, col) {
  const nodeList = [];
  if (row > 0 && !grid[row - 1][col].isVisited)
    nodeList.push(grid[row - 1][col]);
  if (row < grid.length - 1 && !grid[row + 1][col].isVisited)
    nodeList.push(grid[row + 1][col]);
  if (col > 0 && !grid[row][col - 1].isVisited)
    nodeList.push(grid[row][col - 1]);
  if (col < grid[0].length - 1 && !grid[row][col + 1].isVisited)
    nodeList.push(grid[row][col + 1]);
  return nodeList;
}

function checkNeighbourNodes(grid, node) {
  const row = node.row;
  const col = node.col;
  const unvisitedNode = getUnvisitedNodes(grid, row, col);
  unvisitedNode.forEach((n) => {
    n.distance = node.distance + 1;
    n.prevNode = node;
  });
}

export function dijkstra(grid, startNode, endNode) {
  const nodeList = getAllNodes(grid);
  const nodesVisited = [];
  startNode.distance = 0;
  while (nodeList.length !== 0) {
    sortNodeList(nodeList);
    const node = nodeList.shift();
    if (node.row === endNode.row && node.col === endNode.col) break;
    if (node.isVisited) continue;
    if (node.isWall) continue;
    node.isVisited = true;
    nodesVisited.push(node);
    checkNeighbourNodes(grid, node);
  }
  return nodesVisited;
}

export function getNodesinPath(endNode) {
  let currentNode = endNode;
  const pathNode = [];
  while (currentNode !== null) {
    pathNode.unshift(currentNode);
    currentNode = currentNode.prevNode;
  }
  console.log(pathNode.length);
  return pathNode;
}
