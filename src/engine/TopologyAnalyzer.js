// Graph traversal — detects series/parallel structure, mesh loops, KVL/KCL elements
// Operates purely on CircuitGraph data — no solvers, no UI
export default class TopologyAnalyzer {

  // ── Series detection ──────────────────────────────────────────────────────
  // A node is a "series node" if it has exactly 2 adjacency neighbors and
  // all its connected elements are resistors (no sources splitting the chain)
  findSeriesChains(graph) {
    const chains  = [];
    const visited = new Set();

    for (const [nodeId] of graph.nodes) {
      if (visited.has(nodeId) || nodeId === 'gnd') continue;

      const neighbors = [...(graph.adjacency.get(nodeId) ?? [])];
      if (neighbors.length !== 2) continue;

      const elements = [...graph.nodes.get(nodeId).connections]
        .map(id => graph.edges.get(id))
        .filter(Boolean);
      if (!elements.every(e => e.type === 'resistor')) continue;

      // Trace in both directions from this seed node
      visited.add(nodeId);
      const chain = [nodeId];

      for (const startDir of [neighbors[0], neighbors[1]]) {
        let prev    = nodeId;
        let current = startDir;

        while (current && !visited.has(current) && current !== 'gnd') {
          const node       = graph.nodes.get(current);
          const adjList    = [...(graph.adjacency.get(current) ?? [])];
          const currEls    = [...node.connections].map(id => graph.edges.get(id)).filter(Boolean);

          if (adjList.length !== 2 || !currEls.every(e => e.type === 'resistor')) break;

          visited.add(current);
          chain.push(current);
          const next = adjList.find(n => n !== prev);
          prev       = current;
          current    = next;
        }
      }

      if (chain.length > 1) chains.push(chain);
    }

    return chains;
  }

  // ── Parallel detection ────────────────────────────────────────────────────
  // Returns node pairs connected by 2 or more resistors
  findParallelGroups(graph) {
    const groups  = [];
    const checked = new Set();

    for (const [idA, neighbors] of graph.adjacency) {
      for (const idB of neighbors) {
        const key = [idA, idB].sort().join('|');
        if (checked.has(key)) continue;
        checked.add(key);

        const resistors = graph.getElementsBetween(idA, idB)
          .filter(e => e.type === 'resistor');
        if (resistors.length >= 2) {
          groups.push({ nodeA: idA, nodeB: idB, resistors });
        }
      }
    }

    return groups;
  }

  // ── Mesh loop detection (DFS cycle finder) ────────────────────────────────
  findMeshLoops(graph) {
    const loops   = [];
    const visited = new Set();
    const path    = [];

    const dfs = (nodeId, parentId) => {
      visited.add(nodeId);
      path.push(nodeId);

      for (const neighbor of graph.adjacency.get(nodeId) ?? []) {
        if (neighbor === parentId) continue;

        if (visited.has(neighbor)) {
          const loopStart = path.indexOf(neighbor);
          if (loopStart !== -1) {
            loops.push(path.slice(loopStart));
          }
        } else {
          dfs(neighbor, nodeId);
        }
      }

      path.pop();
    };

    for (const [nodeId] of graph.nodes) {
      if (!visited.has(nodeId)) dfs(nodeId, null);
    }

    return loops;
  }

  // ── Topology classification ───────────────────────────────────────────────
  // Returns: 'series' | 'parallel' | 'mixed' | 'unknown'
  classify(graph) {
    const nonGround = graph.nodes.getNonGroundNodes();
    if (nonGround.length === 0) return 'unknown';

    // Series: all non-ground nodes have exactly 2 adjacency neighbors
    const allDegreeTwo = nonGround.every(
      node => (graph.adjacency.get(node.id)?.size ?? 0) === 2
    );
    if (allDegreeTwo) return 'series';

    // Simple parallel: single non-ground node connecting to ground
    // (multiple elements between n and gnd)
    if (nonGround.length === 1) {
      const node      = nonGround[0];
      const toGnd     = graph.getElementsBetween(node.id, 'gnd');
      const resistors = toGnd.filter(e => e.type === 'resistor');
      if (resistors.length >= 2) return 'parallel';
    }

    // Check for multiple loops → mixed
    const loops = this.findMeshLoops(graph);
    if (loops.length > 1) return 'mixed';

    return 'unknown';
  }

  // ── KVL helper ────────────────────────────────────────────────────────────
  // Returns ordered element list around a loop (consecutive node pairs)
  getLoopElements(graph, loopNodes) {
    const elements = [];
    for (let i = 0; i < loopNodes.length; i++) {
      const a   = loopNodes[i];
      const b   = loopNodes[(i + 1) % loopNodes.length];
      const els = graph.getElementsBetween(a, b);
      elements.push(...els);
    }
    return elements;
  }

  // ── KCL helper ────────────────────────────────────────────────────────────
  // Returns all elements incident to a node
  getNodeCurrents(graph, nodeId) {
    const node = graph.nodes.get(nodeId);
    if (!node) return [];
    return [...node.connections]
      .map(id => graph.edges.get(id))
      .filter(Boolean);
  }
}
