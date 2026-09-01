import { escapeHtml } from '../core/format.js';

/**
 * Minimal Markdown → safe HTML (no raw HTML passthrough).
 * Supports: headings, paragraphs, lists, tables, code, blockquote, links, bold/italic, hr, kbd-ish.
 * @param {string} md
 * @returns {string}
 */
export function renderMarkdown(md) {
  if (!md) return '';
  // Strip HTML blocks from source wiki (align divs etc.) — keep text content only via strip tags first on those lines
  let src = String(md)
    .replace(/\r\n/g, '\n')
    .replace(/<!--[\s\S]*?-->/g, '');

  // Remove simple HTML tags but keep inner text
  src = src.replace(/<\/?[^>]+>/g, (tag) => {
    const t = tag.toLowerCase();
    if (t.startsWith('<kbd') || t === '</kbd>') return tag.startsWith('</') ? '</code>' : '<code>';
    return '';
  });

  const lines = src.split('\n');
  /** @type {string[]} */
  const out = [];
  let i = 0;
  let inCode = false;
  /** @type {string[]} */
  let codeBuf = [];
  let inUl = false;
  let inOl = false;
  let inTable = false;
  /** @type {string[]} */
  let tableBuf = [];
  let inBq = false;
  /** @type {string[]} */
  let bqBuf = [];

  const closeLists = () => {
    if (inUl) {
      out.push('</ul>');
      inUl = false;
    }
    if (inOl) {
      out.push('</ol>');
      inOl = false;
    }
  };

  const flushTable = () => {
    if (!inTable) return;
    inTable = false;
    const rows = tableBuf.filter((r) => !/^\s*\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)+\|?\s*$/.test(r));
    tableBuf = [];
    if (!rows.length) return;
    out.push('<div class="md-table-wrap"><table class="md-table">');
    rows.forEach((row, idx) => {
      const cells = splitTableRow(row);
      const tag = idx === 0 ? 'th' : 'td';
      out.push('<tr>');
      for (const c of cells) {
        out.push(`<${tag}>${inline(c)}</${tag}>`);
      }
      out.push('</tr>');
    });
    out.push('</table></div>');
  };

  const flushBq = () => {
    if (!inBq) return;
    inBq = false;
    out.push(`<blockquote><p>${inline(bqBuf.join(' '))}</p></blockquote>`);
    bqBuf = [];
  };

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim().startsWith('```')) {
      closeLists();
      flushTable();
      flushBq();
      if (inCode) {
        out.push(`<pre class="md-pre"><code>${escapeHtml(codeBuf.join('\n'))}</code></pre>`);
        codeBuf = [];
        inCode = false;
      } else {
        inCode = true;
      }
      i += 1;
      continue;
    }
    if (inCode) {
      codeBuf.push(line);
      i += 1;
      continue;
    }

    // table row
    if (/^\s*\|/.test(line) && line.includes('|')) {
      closeLists();
      flushBq();
      inTable = true;
      tableBuf.push(line);
      i += 1;
      continue;
    }
    if (inTable) flushTable();

    // blockquote
    if (/^\s*>\s?/.test(line)) {
      closeLists();
      inBq = true;
      bqBuf.push(line.replace(/^\s*>\s?/, ''));
      i += 1;
      continue;
    }
    if (inBq) flushBq();

    if (/^\s*---+\s*$/.test(line) || /^\s*\*\*\*+\s*$/.test(line)) {
      closeLists();
      out.push('<hr class="md-hr">');
      i += 1;
      continue;
    }

    const hm = line.match(/^(#{1,4})\s+(.+)$/);
    if (hm) {
      closeLists();
      const level = hm[1].length;
      const id = slugify(hm[2]);
      out.push(`<h${level} id="${escapeHtml(id)}">${inline(hm[2])}</h${level}>`);
      i += 1;
      continue;
    }

    const ul = line.match(/^\s*[-*+]\s+(.+)$/);
    if (ul) {
      flushBq();
      if (inOl) {
        out.push('</ol>');
        inOl = false;
      }
      if (!inUl) {
        out.push('<ul>');
        inUl = true;
      }
      out.push(`<li>${inline(ul[1])}</li>`);
      i += 1;
      continue;
    }

    const ol = line.match(/^\s*\d+\.\s+(.+)$/);
    if (ol) {
      flushBq();
      if (inUl) {
        out.push('</ul>');
        inUl = false;
      }
      if (!inOl) {
        out.push('<ol>');
        inOl = true;
      }
      out.push(`<li>${inline(ol[1])}</li>`);
      i += 1;
      continue;
    }

    if (!line.trim()) {
      closeLists();
      i += 1;
      continue;
    }

    closeLists();
    // paragraph — merge consecutive non-empty
    /** @type {string[]} */
    const para = [line];
    i += 1;
    while (i < lines.length && lines[i].trim() && !/^(#{1,4}\s|```|\s*[-*+]\s|\s*\d+\.\s|\s*>|\s*\|)/.test(lines[i])) {
      para.push(lines[i]);
      i += 1;
    }
    out.push(`<p>${inline(para.join(' '))}</p>`);
  }

  closeLists();
  flushTable();
  flushBq();
  if (inCode) {
    out.push(`<pre class="md-pre"><code>${escapeHtml(codeBuf.join('\n'))}</code></pre>`);
  }

  return out.join('\n');
}

/**
 * @param {string} row
 * @returns {string[]}
 */
function splitTableRow(row) {
  let s = row.trim();
  if (s.startsWith('|')) s = s.slice(1);
  if (s.endsWith('|')) s = s.slice(0, -1);
  return s.split('|').map((c) => c.trim());
}

/**
 * @param {string} text
 * @returns {string}
 */
function inline(text) {
  let s = escapeHtml(text);
  // links [text](url)
  s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, url) => {
    const safe = sanitizeUrl(url);
    if (!safe) return label;
    const external = /^https?:\/\//i.test(safe);
    const rel = external ? ' rel="noopener noreferrer" target="_blank"' : '';
    return `<a href="${escapeHtml(safe)}"${rel}>${label}</a>`;
  });
  // bold ** **
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  // italic * *
  s = s.replace(/(^|[^*])\*([^*]+)\*(?!\*)/g, '$1<em>$2</em>');
  // inline code
  s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
  // emoji-ish headers already escaped
  return s;
}

/**
 * @param {string} url
 * @returns {string|null}
 */
function sanitizeUrl(url) {
  const u = String(url).trim();
  if (!u) return null;
  if (u.startsWith('#')) return u;
  if (u.startsWith('/')) return u;
  if (/^https?:\/\//i.test(u)) return u;
  // relative md links → wiki path guess
  if (u.endsWith('.md')) {
    const base = u.replace(/\.md$/i, '').replace(/^\.\//, '');
    return base;
  }
  return null;
}

/**
 * @param {string} text
 * @returns {string}
 */
export function slugify(text) {
  return String(text)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}
