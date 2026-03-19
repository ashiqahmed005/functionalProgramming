import { sleep, logLine, readDelay } from '../utils/ui.js';
import { inOrder, preOrder, postOrder, defaultTree } from '../../concepts/recursion.js';

const TRAVERSALS = {
  inorder:   { label: 'In-Order (L → Root → R)',  fn: inOrder },
  preorder:  { label: 'Pre-Order (Root → L → R)', fn: preOrder },
  postorder: { label: 'Post-Order (L → R → Root)',fn: postOrder },
};

// Tree layout — positions computed for a perfect binary tree of depth 3
const LAYOUT = {
  1: { x: 240, y: 40,  left: 2, right: 3 },
  2: { x: 120, y: 120, left: 4, right: 5 },
  3: { x: 360, y: 120, left: 6, right: 7 },
  4: { x: 60,  y: 200, left: null, right: null },
  5: { x: 180, y: 200, left: null, right: null },
  6: { x: 300, y: 200, left: null, right: null },
  7: { x: 420, y: 200, left: null, right: null },
};

function buildSVG() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'tree');
  svg.setAttribute('width', '480');
  svg.setAttribute('height', '260');

  const edges = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  const nodes = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  const nodeEls = {};

  Object.entries(LAYOUT).forEach(([id, pos]) => {
    if (pos.left) {
      const l = LAYOUT[pos.left];
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('class', 'tree-edge');
      line.setAttribute('x1', pos.x); line.setAttribute('y1', pos.y);
      line.setAttribute('x2', l.x);   line.setAttribute('y2', l.y);
      edges.appendChild(line);
    }
    if (pos.right) {
      const r = LAYOUT[pos.right];
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('class', 'tree-edge');
      line.setAttribute('x1', pos.x); line.setAttribute('y1', pos.y);
      line.setAttribute('x2', r.x);   line.setAttribute('y2', r.y);
      edges.appendChild(line);
    }

    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'tree-node');
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', pos.x); circle.setAttribute('cy', pos.y); circle.setAttribute('r', '20');
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', pos.x); text.setAttribute('y', pos.y);
    text.textContent = id;
    g.append(circle, text);
    nodes.appendChild(g);
    nodeEls[id] = g;
  });

  svg.append(edges, nodes);
  return { svg, nodeEls };
}

export default {
  id: 'recursion',
  label: 'recursion',

  html: () => `
    <h2>Recursion — Tree Traversal</h2>
    <p class="subtitle">Visualize different recursive traversal orders on a binary tree</p>
    <div class="controls">
      <div>
        <label>Traversal</label><br>
        <select id="traversal-mode">
          <option value="inorder">In-Order (L → Root → R)</option>
          <option value="preorder">Pre-Order (Root → L → R)</option>
          <option value="postorder">Post-Order (L → R → Root)</option>
        </select>
      </div>
      <div class="speed-control">
        <label>Speed</label>
        <input type="range" id="rec-speed" min="200" max="1500" value="600" step="100">
      </div>
      <button class="btn" id="rec-run">Run</button>
      <button class="btn secondary" id="rec-reset">Reset</button>
    </div>
    <div class="tree-container" id="tree-viz"></div>
    <div class="log" id="rec-log"></div>
    <details class="source-block">
      <summary><span class="ti">▶</span> Source Code <span class="sf">concepts/recursion.js</span></summary>
      <pre><span class="c">// In-order traversal: left → root → right</span>
export const inOrder = n =>
  n === null ? [] : [...inOrder(n.left), n.value, ...inOrder(n.right)];

<span class="c">// Tail-call optimized factorial (accumulator pattern)</span>
export const factTCO = (n, acc = 1) =>
  n &lt;= 1 ? acc : factTCO(n - 1, n * acc);

<span class="c">// Sum without loops — pattern-match via destructuring</span>
export const sum = ([head, ...tail]) =>
  head === undefined ? 0 : head + sum(tail);</pre>
    </details>`,

  mount(el) {
    let nodeEls = {};
    let running = false;

    const reset = () => {
      const container = el.querySelector('#tree-viz');
      container.innerHTML = '';
      const built = buildSVG();
      container.appendChild(built.svg);
      nodeEls = built.nodeEls;
      el.querySelector('#rec-log').innerHTML = '';
    };

    el.querySelector('#rec-reset').addEventListener('click', reset);

    el.querySelector('#rec-run').addEventListener('click', async () => {
      if (running) return;
      running = true;
      reset();

      const mode  = el.querySelector('#traversal-mode').value;
      const delay = readDelay('rec-speed');
      const log   = el.querySelector('#rec-log');
      const trav  = TRAVERSALS[mode];

      logLine(log, `<span class="info">${trav.label}</span>`);
      const order = trav.fn(defaultTree);

      for (const val of order) {
        const g = nodeEls[val];
        g.setAttribute('class', 'tree-node current');
        logLine(log, `<span class="step">  visit ${val}</span>`);
        await sleep(delay);
        g.setAttribute('class', 'tree-node visited');
      }

      logLine(log, `<span class="ok">✓ [${order.join(', ')}]</span>`);
      running = false;
    });

    reset();
  },
};
