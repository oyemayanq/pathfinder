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

function pushNodesinStack(grid, stack, node) {
  const unvisitedNodes = getUnvisitedNodes(grid, node.row, node.col);
  unvisitedNodes.forEach((n) => {
    n.distance = node.distance + 1;
    n.prevNode = node;
    stack.push(n);
  });
}

export function dfs(grid, startNode, endNode) {
  const nodesVisited = [];
  const stack = [];
  stack.push(startNode);
  startNode.distance = 0;
  while (stack.length !== 0) {
    const node = stack.pop();
    if (node.row === endNode.row && node.col === endNode.col) break;
    if (node.isWall) continue;
    if (node.isVisited) continue;
    node.isVisited = true;
    nodesVisited.push(node);
    pushNodesinStack(grid, stack, node);
  }
  return nodesVisited;
}
