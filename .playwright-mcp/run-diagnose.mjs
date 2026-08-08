// Runner standalone: executa .playwright-mcp/test-diagnose.js sem depender do MCP server
import { chromium } from '/home/matteo.zanona/.npm/_npx/9833c18b2d85bc59/node_modules/playwright/index.mjs';
import fs from 'fs';

const testPath = '/home/matteo.zanona/Documentos/capiquake-dev/.playwright-mcp/test-diagnose.js';
const src = fs.readFileSync(testPath, 'utf8');

// O arquivo de teste é `async (page) => {...}` — avalia como função
const testFn = eval(`(${src})`);

const browser = await chromium.launch({
  headless: true,
  executablePath: '/home/matteo.zanona/.cache/ms-playwright/chromium-1228/chrome-linux64/chrome',
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

globalThis.browser = browser;
const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
const page = await ctx.newPage();

try {
  const result = await testFn(page);
  console.log('=== TEST RESULT ===');
  console.log(result);
} catch (e) {
  console.error('=== TEST FAILED ===');
  console.error(e && e.stack ? e.stack : String(e));
}

await browser.close().catch(() => {});
process.exit(0);
