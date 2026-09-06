import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const baseUrl = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:4000';
const outputDir = process.env.SMOKE_OUTPUT_DIR || 'artifacts/browser-smoke';

const routes = [
  '/',
  '/trillionbank/company/',
  '/trillionbank/business/',
  '/trillionbank/business/hack2/',
  '/trillionbank/business/pay-per-crawl/',
  '/trillionbank/insights/',
  '/trillionbank/contact/',
  '/trillionbank/meeting/',
  '/trillionbank/privacy/',
  '/trillionbank/terms/',
  '/trillionbank/security/'
];

const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 }
];

const knownExternalHosts = new Set([
  'www.googletagmanager.com',
  'www.google-analytics.com',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'sdk.form.run'
]);

function slugFor(route) {
  return route === '/' ? 'home' : route.replace(/^\//, '').replace(/\/$/, '').replaceAll('/', '__');
}

function isIgnorableConsoleError(message) {
  return /ERR_FAILED|Failed to load resource|net::ERR_|favicon/i.test(message);
}

await fs.mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const results = [];
const failures = [];

try {
  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 1
    });

    for (const route of routes) {
      const page = await context.newPage();
      const consoleErrors = [];
      const pageErrors = [];

      page.on('console', (msg) => {
        if (msg.type() === 'error' && !isIgnorableConsoleError(msg.text())) {
          consoleErrors.push(msg.text());
        }
      });
      page.on('pageerror', (error) => pageErrors.push(error.message));

      await page.route('**/*', async (requestRoute) => {
        const requestUrl = new URL(requestRoute.request().url());
        if (requestUrl.origin === new URL(baseUrl).origin) {
          await requestRoute.continue();
          return;
        }
        if (knownExternalHosts.has(requestUrl.hostname)) {
          await requestRoute.abort();
          return;
        }
        await requestRoute.continue();
      });

      const url = new URL(route, baseUrl).toString();
      let response;
      let navigationError = null;
      try {
        response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30_000 });
        await page.waitForTimeout(500);
      } catch (error) {
        navigationError = error.message;
      }

      const status = response?.status() ?? null;
      const title = await page.title().catch(() => '');
      const h1Count = await page.locator('h1').count().catch(() => 0);
      const bodyText = await page.locator('body').innerText().catch(() => '');
      const overflow = await page.evaluate(() => ({
        viewportWidth: window.innerWidth,
        documentWidth: document.documentElement.scrollWidth,
        bodyWidth: document.body.scrollWidth
      })).catch(() => ({ viewportWidth: 0, documentWidth: 0, bodyWidth: 0 }));

      const routeFailures = [];
      if (navigationError) routeFailures.push(`navigation: ${navigationError}`);
      if (status !== null && status >= 400) routeFailures.push(`HTTP ${status}`);
      if (!title.trim()) routeFailures.push('missing document title');
      if (h1Count < 1) routeFailures.push('missing h1');
      if (/404|not found/i.test(bodyText.slice(0, 800))) routeFailures.push('404-like body text');
      if (overflow.documentWidth > overflow.viewportWidth + 2 || overflow.bodyWidth > overflow.viewportWidth + 2) {
        routeFailures.push(`horizontal overflow ${Math.max(overflow.documentWidth, overflow.bodyWidth)}px > ${overflow.viewportWidth}px`);
      }
      if (pageErrors.length) routeFailures.push(`page errors: ${pageErrors.join(' | ')}`);
      if (consoleErrors.length) routeFailures.push(`console errors: ${consoleErrors.join(' | ')}`);

      if (route === '/trillionbank/contact/') {
        const formCount = await page.locator('.formrun-embed, form').count();
        const meetingLinkCount = await page.locator('a[href^="/trillionbank/meeting/"]').count();
        if (formCount < 1) routeFailures.push('contact form container missing');
        if (meetingLinkCount < 1) routeFailures.push('meeting CTA missing');
      }

      if (route === '/trillionbank/business/hack2/') {
        const consultationCtaCount = await page.locator('a[href*="/trillionbank/meeting/"], a[href*="/trillionbank/contact/"]').count();
        if (consultationCtaCount < 1) routeFailures.push('HackII consultation CTA missing');
      }

      const screenshotPath = path.join(outputDir, `${viewport.name}__${slugFor(route)}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });

      const result = {
        viewport: viewport.name,
        route,
        url,
        status,
        title,
        h1Count,
        overflow,
        consoleErrors,
        pageErrors,
        failures: routeFailures,
        screenshot: screenshotPath
      };
      results.push(result);
      if (routeFailures.length) failures.push(result);
      await page.close();
    }

    await context.close();
  }
} finally {
  await browser.close();
}

await fs.writeFile(
  path.join(outputDir, 'report.json'),
  JSON.stringify({ generatedAt: new Date().toISOString(), baseUrl, results }, null, 2),
  'utf8'
);

if (failures.length) {
  console.error(`Browser smoke failed for ${failures.length} page/viewport combinations.`);
  for (const failure of failures) {
    console.error(`- ${failure.viewport} ${failure.route}: ${failure.failures.join('; ')}`);
  }
  process.exit(1);
}

console.log(`Browser smoke passed: ${results.length} page/viewport combinations.`);
