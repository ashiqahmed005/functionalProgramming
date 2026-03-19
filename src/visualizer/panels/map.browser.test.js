/**
 * Browser tests for the map panel.
 *
 * Tests panel mounting, control rendering, and the step-by-step animation.
 * The speed slider is set to max (1000) so each cell animates in ~100ms
 * instead of the default 700ms — keeps the suite fast while exercising
 * the real async code path.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import mapPanel from './map.js';

let container;

beforeEach(() => {
  container = document.createElement('div');
  container.innerHTML = mapPanel.html();
  document.body.appendChild(container);
  // Max speed: delay = 1100 - 1000 = 100ms per step
  container.querySelector('#map-speed').value = '1000';
  mapPanel.mount(container);
});

afterEach(() => container.remove());

// ── Structure ─────────────────────────────────────────────────────────────────
describe('map panel — structure', () => {
  it('renders h2 heading', () => {
    expect(container.querySelector('h2').textContent).toBe('map');
  });

  it('renders array input with default value', () => {
    expect(container.querySelector('#map-input').value).toBe('1,2,3,4,5');
  });

  it('renders transform select with options', () => {
    const opts = container.querySelectorAll('#map-fn option');
    expect(opts.length).toBeGreaterThanOrEqual(4);
  });

  it('renders speed slider', () => {
    expect(container.querySelector('#map-speed')).not.toBeNull();
  });

  it('renders run button', () => {
    expect(container.querySelector('#map-run')).not.toBeNull();
  });

  it('renders log and viz containers', () => {
    expect(container.querySelector('#map-viz')).not.toBeNull();
    expect(container.querySelector('#map-log')).not.toBeNull();
  });

  it('has collapsible source-block details', () => {
    expect(container.querySelector('details.source-block')).not.toBeNull();
  });
});

// ── Behaviour ─────────────────────────────────────────────────────────────────
describe('map panel — behaviour', () => {
  // Wait long enough for all 5 cells at 100ms each + 50ms half-step gaps
  const RUN_TIME = 5 * (100 + 50) + 300;

  it('auto-runs on mount — viz rows appear', async () => {
    await new Promise(r => setTimeout(r, RUN_TIME));
    const rows = container.querySelectorAll('.array-row');
    expect(rows.length).toBe(2); // input row + output row
  });

  it('output cells are filled after animation', async () => {
    await new Promise(r => setTimeout(r, RUN_TIME));
    const mapped = container.querySelectorAll('.cell.mapped');
    expect(mapped.length).toBe(5);
  });

  it('x*2 transform doubles each value', async () => {
    // Default select is x*2 and default input is 1,2,3,4,5
    await new Promise(r => setTimeout(r, RUN_TIME));
    const cells = [...container.querySelectorAll('.cell.mapped')];
    const values = cells.map(c => Number(c.textContent));
    expect(values).toEqual([2, 4, 6, 8, 10]);
  });

  it('log shows result line', async () => {
    await new Promise(r => setTimeout(r, RUN_TIME));
    const log = container.querySelector('#map-log');
    expect(log.textContent).toContain('2, 4, 6, 8, 10');
  });

  it('changing transform and re-running updates output', async () => {
    await new Promise(r => setTimeout(r, RUN_TIME));

    // Switch to x*x
    container.querySelector('#map-fn').value = 'x*x';
    container.querySelector('#map-run').click();
    await new Promise(r => setTimeout(r, RUN_TIME));

    const cells  = [...container.querySelectorAll('.cell.mapped')];
    const values = cells.map(c => Number(c.textContent));
    expect(values).toEqual([1, 4, 9, 16, 25]);
  });

  it('changing input array and re-running uses new values', async () => {
    await new Promise(r => setTimeout(r, RUN_TIME));

    container.querySelector('#map-input').value = '10,20,30';
    container.querySelector('#map-run').click();
    await new Promise(r => setTimeout(r, 3 * (100 + 50) + 300));

    const cells  = [...container.querySelectorAll('.cell.mapped')];
    const values = cells.map(c => Number(c.textContent));
    expect(values).toEqual([20, 40, 60]);
  });

  it('does not start a second run while one is in progress', async () => {
    // Click twice in quick succession
    container.querySelector('#map-run').click();
    container.querySelector('#map-run').click();

    await new Promise(r => setTimeout(r, RUN_TIME));
    // Still only one set of output cells (not doubled)
    const mapped = container.querySelectorAll('.cell.mapped');
    expect(mapped.length).toBe(5);
  });
});
