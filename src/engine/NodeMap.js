// O(1) node lookup — wraps Map with circuit-specific helpers
export default class NodeMap {
  constructor() {
    this._map = new Map();
  }

  set(id, node)  { this._map.set(id, node); }
  get(id)        { return this._map.get(id); }
  has(id)        { return this._map.has(id); }
  delete(id)     { this._map.delete(id); }
  get size()     { return this._map.size; }

  [Symbol.iterator]() { return this._map[Symbol.iterator](); }
  entries()      { return this._map.entries(); }
  values()       { return this._map.values(); }
  keys()         { return this._map.keys(); }

  // All nodes except the fixed ground reference
  getNonGroundNodes() {
    return [...this._map.values()].filter(n => n.id !== 'gnd');
  }

  // BFS from startId — returns Set of reachable node IDs
  bfsFrom(startId, graph) {
    const visited = new Set([startId]);
    const queue = [startId];
    while (queue.length > 0) {
      const current = queue.shift();
      for (const neighbor of graph.adjacency.get(current) ?? []) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }
    return visited;
  }

  // Merge two nodes into one — used during series simplification
  // Updates all edge references and the adjacency list in graph
  mergeNodes(idA, idB, newId, graph) {
    const nodeA = this._map.get(idA);
    const nodeB = this._map.get(idB);
    if (!nodeA || !nodeB) return;

    const merged = {
      id: newId,
      voltage: null,
      connections: new Set([...nodeA.connections, ...nodeB.connections]),
    };
    this._map.set(newId, merged);
    this._map.delete(idA);
    this._map.delete(idB);

    // Redirect any edge that referenced idA or idB
    for (const el of graph.edges.values()) {
      if (el.nodeA === idA || el.nodeA === idB) el.nodeA = newId;
      if (el.nodeB === idA || el.nodeB === idB) el.nodeB = newId;
    }

    // Rebuild adjacency for the new merged node
    const adjA = graph.adjacency.get(idA) ?? new Set();
    const adjB = graph.adjacency.get(idB) ?? new Set();
    const mergedAdj = new Set([...adjA, ...adjB]);
    mergedAdj.delete(idA);
    mergedAdj.delete(idB);

    graph.adjacency.delete(idA);
    graph.adjacency.delete(idB);
    graph.adjacency.set(newId, mergedAdj);

    // Update each neighbor to point to newId
    for (const neighborId of mergedAdj) {
      const adj = graph.adjacency.get(neighborId);
      if (adj) {
        adj.delete(idA);
        adj.delete(idB);
        adj.add(newId);
      }
    }
  }
}
