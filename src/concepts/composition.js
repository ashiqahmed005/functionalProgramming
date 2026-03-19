/**
 * Function Composition & Pipelines
 *
 * compose(f, g)(x) === f(g(x))  — right-to-left
 * pipe(f, g)(x)    === g(f(x))  — left-to-right (more readable for data pipelines)
 */

export const compose = (...fns) => x => fns.reduceRight((acc, fn) => fn(acc), x);
export const pipe    = (...fns) => x => fns.reduce((acc, fn) => fn(acc), x);

// ─── String primitives used in the slugify demo ───────────────────────────────
export const trim          = s => s.trim();
export const toLower       = s => s.toLowerCase();
export const toUpper       = s => s.toUpperCase();
export const replace       = (from, to) => s => s.replace(new RegExp(from, 'g'), to);
export const replaceSpaces = replace('\\s+', '-');
export const removeSpecial = replace('[^a-z0-9-]', '');

// ─── Built with pipe ─────────────────────────────────────────────────────────
export const slugify = pipe(trim, toLower, replaceSpaces, removeSpecial);
