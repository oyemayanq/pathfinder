function getUnvisitedNodes(grid, row, col) {
  const unvisitedNodes = [];
  if (row > 0 && !grid[row - 1][col].isVisited)
    unvisitedNodes.push(grid[row - 1][col]);
  if (row < grid.length - 1 && !grid[row + 1][col].isVisited)
    unvisitedNodes.push(grid[row + 1][col]);
  if (col > 0 && !grid[row][col - 1].isVisited)
    unvisitedNodes.push(grid[row][col - 1]);
  if (col < grid[0].length - 1 && !grid[row][col + 1].isVisited)
    unvisitedNodes.push(grid[row][col + 1]);

  return unvisitedNodes;
}

function pushNodesinQueue(grid, queue, node) {
  const unvisitedNodes = getUnvisitedNodes(grid, node.row, node.col);
  unvisitedNodes.forEach((n) => {
    n.distance = node.distance + 1;
    n.prevNode = node;
    queue.push(n);
  });
}

export function bfs(grid, startNode, endNode) {
  const nodesVisited = [];
  const queue = [];
  startNode.distance = 0;
  queue.push(startNode);
  while (queue.length !== 0) {
    const node = queue.shift();
    if (node.row === endNode.row && node.col === endNode.col) break;
    if (node.isWall) continue;
    if (node.isVisited) continue;
    node.isVisited = true;
    nodesVisited.push(node);
    pushNodesinQueue(grid, queue, node);
  }
  return nodesVisited;
}
