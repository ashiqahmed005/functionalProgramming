/**
 * Browser tests for the top-level app shell.
 *
 * These tests run inside real Chromium via Playwright — `document` and
 * `window` are genuine browser APIs, not jsdom stubs.
 *
 * Each test gets a fresh copy of the app DOM via beforeEach so tests
 * never bleed into each other.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { initApp } from './app.js';

// ── Minimal HTML the app shell needs ─────────────────────────────────────────
function mountApp() {
  document.body.innerHTML = `
    <header id="header">
      <div class="header-brand">FP</div>
      <div class="header-right">
        <span class="header-stat"></span>
        <button id="sidebar-toggle">☰</button>
      </div>
    </header>
    <div class="app-layout">
      <aside id="sidebar"></aside>
      <main  id="main"></main>
    </div>
  `;
  initApp();
}

beforeEach(() => mountApp());
afterEach(() => { document.body.innerHTML = ''; });

// ── Sidebar ───────────────────────────────────────────────────────────────────
describe('Sidebar', () => {
  it('is visible on load', () => {
    const sidebar = document.getElementById('sidebar');
    expect(sidebar.classList.contains('collapsed')).toBe(false);
  });

  it('collapses when toggle button is clicked', () => {
    document.getElementById('sidebar-toggle').click();
    expect(document.getElementById('sidebar').classList.contains('collapsed')).toBe(true);
  });

  it('expands again on second click', () => {
    const btn = document.getElementById('sidebar-toggle');
    btn.click();
    btn.click();
    expect(document.getElementById('sidebar').classList.contains('collapsed')).toBe(false);
  });
});

// ── Sidebar nav structure ─────────────────────────────────────────────────────
describe('Sidebar nav', () => {
  it('renders category sections', () => {
    const cats = document.querySelectorAll('.nav-category');
    expect(cats.length).toBeGreaterThan(0);
  });

  it('renders at least one nav panel button per category', () => {
    const btns = document.querySelectorAll('.nav-panel-btn');
    expect(btns.length).toBeGreaterThan(10);
  });

  it('first category is open on load', () => {
    const firstCat = document.querySelector('.nav-category');
    expect(firstCat.classList.contains('open')).toBe(true);
  });

  it('header-stat shows topic count', () => {
    const stat = document.querySelector('.header-stat');
    expect(stat.textContent).toMatch(/\d+ topics/);
  });
});

// ── Navigation ────────────────────────────────────────────────────────────────
describe('Panel navigation', () => {
  it('first panel is active on load', () => {
    const active = document.querySelector('.panel.active');
    expect(active).not.toBeNull();
  });

  it('clicking a nav button activates that panel', () => {
    // Click the second nav button (different from the default first panel)
    const btns = document.querySelectorAll('.nav-panel-btn');
    const target = btns[1];
    const panelId = target.dataset.panel;
    target.click();

    const activePanel = document.querySelector('.panel.active');
    expect(activePanel.id).toBe(`panel-${panelId}`);
  });

  it('active nav button gets .active class', () => {
    const btns    = document.querySelectorAll('.nav-panel-btn');
    const target  = btns[2];
    target.click();
    expect(target.classList.contains('active')).toBe(true);
  });

  it('previous panel loses .active class on navigation', () => {
    const btns = document.querySelectorAll('.nav-panel-btn');
    btns[0].click();
    btns[1].click();
    expect(btns[0].classList.contains('active')).toBe(false);
  });

  it('prev/next topbar buttons navigate between panels', () => {
    // Start on first panel, click "next"
    const nextBtn = document.querySelector('.panel.active .panel-nav-btn[data-dir="next"]');
    nextBtn.click();

    const active = document.querySelector('.panel.active');
    expect(active).not.toBeNull();

    // prev button on the new panel should work (not disabled)
    const prevBtn = active.querySelector('.panel-nav-btn[data-dir="prev"]');
    expect(prevBtn.disabled).toBe(false);
  });
});

// ── Category accordion ────────────────────────────────────────────────────────
describe('Category accordion', () => {
  it('clicking a closed category opens it', () => {
    // Find a category that is NOT open yet
    const closed = [...document.querySelectorAll('.nav-category')]
      .find(el => !el.classList.contains('open'));

    if (!closed) return; // all open — skip

    closed.querySelector('.nav-cat-header').click();
    expect(closed.classList.contains('open')).toBe(true);
  });

  it('clicking an open category closes it', () => {
    const open = document.querySelector('.nav-category.open');
    open.querySelector('.nav-cat-header').click();
    expect(open.classList.contains('open')).toBe(false);
  });
});

// ── Search ────────────────────────────────────────────────────────────────────
describe('Sidebar search', () => {
  async function typeSearch(query) {
    const input = document.getElementById('sidebar-search');
    input.value = query;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    // Wait for 150ms debounce + a little buffer
    await new Promise(r => setTimeout(r, 200));
  }

  it('hides non-matching nav buttons', async () => {
    await typeSearch('map');
    const visible = [...document.querySelectorAll('.nav-panel-btn')]
      .filter(b => b.style.display !== 'none');
    // Every visible button should contain "map" (case-insensitive)
    visible.forEach(b =>
      expect(b.textContent.toLowerCase()).toContain('map'));
  });

  it('shows all buttons when search is cleared', async () => {
    await typeSearch('map');
    await typeSearch('');
    const hidden = [...document.querySelectorAll('.nav-panel-btn')]
      .filter(b => b.style.display === 'none');
    expect(hidden.length).toBe(0);
  });

  it('shows empty state message for no results', async () => {
    await typeSearch('zzznomatch');
    const empty = document.querySelector('.sidebar-empty');
    expect(empty).not.toBeNull();
    expect(empty.textContent).toContain('zzznomatch');
  });

  it('removes empty state when search is cleared', async () => {
    await typeSearch('zzznomatch');
    await typeSearch('');
    expect(document.querySelector('.sidebar-empty')).toBeNull();
  });
});
