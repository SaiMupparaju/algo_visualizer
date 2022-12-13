// Performs Dijkstra's algorithm; returns *all* nodes in the order
// in which they were visited. Also makes nodes point back to their
// previous node, effectively allowing us to compute the shortest path
// by backtracking from the finish node.
export function bellmanford(grid, startNode, finishNode) {
    const visitedNodesInOrder = [startNode];
    startNode.distance = 0;
    
    const curNodes = [startNode];
    for (let n = grid.length*grid[0].length - 1; n > 0; n-- ) {
      const temp = [];  
      for (const node of curNodes){
        const neighbors = getNeighbors(grid, node);
        for (const neighbor of neighbors) {
          if (neighbor.isWall){
            continue;
          }else if (neighbor.distance > node.weight + node.distance){
            console.log(node.weight);
            neighbor.distance = node.distance + node.weight;
            neighbor.previousNode = node;
            temp.push(neighbor);
          }
        }
      }
      for (let i = 0 ; i < curNodes.length; i ++ ){
        curNodes.unshift();
      }

      for(const node of temp){
        visitedNodesInOrder.push(node);
        curNodes.push(node);
      }
      n--;
    }
    console.log(visitedNodesInOrder.length);
    return visitedNodesInOrder;
  }
  

  function getNeighbors(grid, node) {
    const neighbors = [];
    const {col, row} = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors;
  }
  
  
  function getAllNodes(grid) {
    const nodes = [];
    for (const row of grid) {
      for (const node of row) {
        nodes.push(node);
      }
    }
    return nodes;
  }
  
  // Backtracks from the finishNode to find the shortest path.
  // Only works when called *after* the dijkstra method above.
  export function getNodesInShortestPathOrder(finishNode) {
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
      nodesInShortestPathOrder.unshift(currentNode);
      currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
  }