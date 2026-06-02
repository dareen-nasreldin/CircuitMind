import NodeMap from './NodeMap.js';

// Core graph model — rendering-agnostic, no DOM/SVG references
// Nodes: NodeMap (O(1) lookup)
// Edges: Map of circuit elements
// Adjacency: Map<nodeId, Set<nodeId>> — updated on every add/remove
export default class CircuitGraph {
  constructor() {
    this.nodes      = new NodeMap();
    this.edges      = new Map();   // elementId → element object
    this.adjacency  = new Map();   // nodeId    → Set<nodeId>

    // Ground node is always present at 0 V
    this._initNode('gnd', 0);
  }

  // ─── Nodes ───────────────────────────────────────────────────────────────

  _initNode(id, voltage = null) {
    this.nodes.set(id, { id, voltage, connections: new Set() });
    this.adjacency.set(id, new Set());
  }

  addNode(id) {
    if (!this.nodes.has(id)) this._initNode(id);
    return this;
  }

  // ─── Elements ────────────────────────────────────────────────────────────

  // type: 'resistor' | 'voltage_source' | 'current_source'
  addElement(id, type, value, nodeA, nodeB) {
    if (!this.nodes.has(nodeA)) this.addNode(nodeA);
    if (!this.nodes.has(nodeB)) this.addNode(nodeB);

    const el = { id, type, value, nodeA, nodeB, current: null };
    this.edges.set(id, el);

    // Keep node connection sets in sync
    this.nodes.get(nodeA).connections.add(id);
    this.nodes.get(nodeB).connections.add(id);

    // Keep adjacency list in sync
    this.adjacency.get(nodeA).add(nodeB);
    this.adjacency.get(nodeB).add(nodeA);

    return this;
  }

  removeElement(id) {
    const el = this.edges.get(id);
    if (!el) return this;

    this.nodes.get(el.nodeA)?.connections.delete(id);
    this.nodes.get(el.nodeB)?.connections.delete(id);
    this.edges.delete(id);

    // Only remove adjacency edge if no other element still connects these nodes
    const stillLinked = [...this.edges.values()].some(
      e =>
        (e.nodeA === el.nodeA && e.nodeB === el.nodeB) ||
        (e.nodeA === el.nodeB && e.nodeB === el.nodeA)
    );
    if (!stillLinked) {
      this.adjacency.get(el.nodeA)?.delete(el.nodeB);
      this.adjacency.get(el.nodeB)?.delete(el.nodeA);
    }

    return this;
  }

  // ─── Queries ─────────────────────────────────────────────────────────────

  getNeighbors(nodeId) {
    return this.adjacency.get(nodeId) ?? new Set();
  }

  getElementsBetween(nodeA, nodeB) {
    return [...this.edges.values()].filter(
      e =>
        (e.nodeA === nodeA && e.nodeB === nodeB) ||
        (e.nodeA === nodeB && e.nodeB === nodeA)
    );
  }

  // ─── Source manipulation ──────────────────────────────────────────────────

  // Deactivate ALL independent sources (used for R_th step of Thevenin/Norton)
  // Modifies this graph in-place — always call on a clone
  deactivateSources() {
    for (const el of this.edges.values()) {
      if (el.type === 'voltage_source') {
        el.type  = 'short_circuit';
        el.value = 0;
      } else if (el.type === 'current_source') {
        el.type = 'open_circuit';
      }
    }
    return this;
  }

  // Deactivate all sources EXCEPT the one with keepId (used for Superposition)
  deactivateAllExcept(keepId) {
    for (const el of this.edges.values()) {
      if (el.id === keepId) continue;
      if (el.type === 'voltage_source') {
        el.type  = 'short_circuit';
        el.value = 0;
      } else if (el.type === 'current_source') {
        el.type = 'open_circuit';
      }
    }
    return this;
  }

  // ─── Clone ───────────────────────────────────────────────────────────────

  // Returns a fully independent deep copy — mutations don't affect the original
  clone() {
    const g = new CircuitGraph();
    g.nodes     = new NodeMap();
    g.edges     = new Map();
    g.adjacency = new Map();

    for (const [id, node] of this.nodes) {
      g.nodes.set(id, {
        id:          node.id,
        voltage:     node.voltage,
        connections: new Set(node.connections),
      });
      g.adjacency.set(id, new Set(this.adjacency.get(id) ?? []));
    }

    for (const [id, el] of this.edges) {
      g.edges.set(id, { ...el });
    }

    return g;
  }

  // ─── Serialization ───────────────────────────────────────────────────────

  // Produces a plain-object snapshot — no Map/Set references, safe to store in step arrays
  serialize() {
    const nodes = {};
    for (const [id, node] of this.nodes) {
      nodes[id] = { id: node.id, voltage: node.voltage };
    }
    const edges = {};
    for (const [id, el] of this.edges) {
      edges[id] = { ...el };
    }
    return { nodes, edges };
  }
}
