import hljs from 'highlight.js/lib/core';

// Register only the languages we actually use (keeps bundle small)
import javascript from 'highlight.js/lib/languages/javascript';
import css        from 'highlight.js/lib/languages/css';
import xml        from 'highlight.js/lib/languages/xml';

hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('css',        css);
hljs.registerLanguage('xml',        xml);   // covers HTML

/**
 * Highlight all <pre> blocks inside a panel element.
 * Called once per panel after its mount() runs.
 *
 * Existing hand-written <span class="c"> comment spans are preserved —
 * hljs only runs on blocks that have not already been highlighted.
 */
export function highlightPanel(panelEl) {
  panelEl.querySelectorAll('details.source-block pre').forEach(block => {
    if (block.dataset.highlighted) return;        // already done
    const raw = block.textContent;                // strip existing spans
    const result = hljs.highlight(raw, { language: 'javascript' });
    block.innerHTML = result.value;
    block.dataset.highlighted = 'true';
  });
}
