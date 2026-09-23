import { chromium } from "playwright";

const ROUTES = [
  "/",
  "/verkennen",
  "/politici",
  "/politici/dilan-yesilgoz-zegerius",
  "/partijen",
  "/partij/d66",
  "/ideologie/sociaal-democraat",
  "/stelling/e001",
  "/woordenboek/tweede-kamer",
  "/methodiek",
  "/privacy",
  "/voorwaarden",
  "/docs/api",
  "/contact",
  "/quiz/quick",
  "/quiz/standard",
  "/coalitie",
  "/turing-test",
  "/vergelijk",
  "/evolutie",
];

const VIEWPORTS = [
  [320, 700],
  [360, 800],
  [375, 812],
  [390, 844],
  [430, 932],
  [768, 1024],
  [1024, 768],
  [1440, 900],
  [1920, 1080],
];

const args = process.argv.slice(2);
const valueFor = (name, fallback) => {
  const direct = args.find((arg) => arg.startsWith(`${name}=`));
  if (direct) return direct.slice(name.length + 1);
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : fallback;
};
const has = (name) => args.includes(name);
const baseUrl = valueFor("--base-url", process.env.QA_BASE_URL || "http://127.0.0.1:3417").replace(/\/$/, "");
const routeFilter = valueFor("--route", "");
const routes = routeFilter ? ROUTES.filter((route) => route.includes(routeFilter)) : ROUTES;
const viewports = has("--quick") ? [[320, 700], [768, 1024], [1440, 900]] : VIEWPORTS;
const resultFixture = valueFor("--result-fixture", process.env.QA_RESULT_FIXTURE || "");
if (resultFixture) routes.push(`/r/${encodeURIComponent(resultFixture)}`);

const browser = await chromium.launch({ headless: true });
const failures = [];
const records = [];

function fail(route, viewport, issue, detail = "") {
  failures.push({ route, viewport, issue, detail });
}

for (const [width, height] of viewports) {
  const viewport = `${width}x${height}`;
  const context = await browser.newContext({
    viewport: { width, height },
    reducedMotion: "reduce",
    colorScheme: "light",
  });

  for (const route of routes) {
    const page = await context.newPage();
    const consoleErrors = [];
    const pageErrors = [];
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    page.on("pageerror", (error) => pageErrors.push(error.message));

    let response;
    try {
      response = await page.goto(`${baseUrl}${route}`, {
        waitUntil: "domcontentloaded",
        timeout: 35_000,
      });
      await page.waitForTimeout(350);
    } catch (error) {
      fail(route, viewport, "navigation", error instanceof Error ? error.message : String(error));
      await page.close();
      continue;
    }

    const status = response?.status() ?? 0;
    if (status < 200 || status >= 400) fail(route, viewport, "status", String(status));

    const metrics = await page.evaluate(() => {
      const root = document.documentElement;
      const viewportWidth = root.clientWidth;
      const isVisible = (element) => {
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return (
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          Number(style.opacity) > 0 &&
          rect.width > 0 &&
          rect.height > 0
        );
      };
      const clipsX = (element) => {
        let current = element.parentElement;
        while (current && current !== document.body) {
          const overflow = getComputedStyle(current).overflowX;
          if (["auto", "scroll", "hidden", "clip"].includes(overflow)) return true;
          current = current.parentElement;
        }
        return false;
      };
      const labelFor = (element) => {
        const id = element.id ? `#${element.id}` : "";
        const classes = typeof element.className === "string"
          ? `.${element.className.trim().split(/\s+/).slice(0, 3).join(".")}`
          : "";
        return `${element.tagName.toLowerCase()}${id}${classes}`.slice(0, 150);
      };

      const wide = [];
      const ownOverflow = [];
      document.querySelectorAll("body *").forEach((element) => {
        if (!(element instanceof HTMLElement || element instanceof SVGElement) || !isVisible(element)) return;
        if (["SCRIPT", "STYLE", "NOSCRIPT"].includes(element.tagName)) return;
        if (element instanceof SVGElement) return;
        const rect = element.getBoundingClientRect();
        if ((rect.left < -3 || rect.right > viewportWidth + 3) && !clipsX(element)) {
          wide.push(`${labelFor(element)} [${Math.round(rect.left)},${Math.round(rect.right)}]`);
        }
        if (element instanceof HTMLElement) {
          const style = getComputedStyle(element);
          const overflow = style.overflowX;
          if (
            !["auto", "scroll", "hidden", "clip"].includes(overflow) &&
            !clipsX(element) &&
            element.scrollWidth > viewportWidth + 3 &&
            element.clientWidth > 0
          ) {
            ownOverflow.push(`${labelFor(element)} ${element.scrollWidth}/${element.clientWidth}`);
          }
        }
      });

      const smallTargets = [];
      if (window.innerWidth <= 430) {
        const selector = [
          "button:not([disabled])",
          "[role='button']",
          "[role='radio']",
          "input:not([type='hidden']):not([type='checkbox']):not([type='radio']):not([disabled])",
          "select:not([disabled])",
          "textarea:not([disabled])",
          "a.btn",
        ].join(",");
        document.querySelectorAll(selector).forEach((element) => {
          if (!(element instanceof HTMLElement) || !isVisible(element)) return;
          const rect = element.getBoundingClientRect();
          if (rect.width < 44 || rect.height < 44) {
            smallTargets.push(`${labelFor(element)} ${Math.round(rect.width)}x${Math.round(rect.height)}`);
          }
        });
      }

      const wrappedAffordances = [];
      document.querySelectorAll(".btn, [role='radio']").forEach((element) => {
        if (!(element instanceof HTMLElement) || !isVisible(element)) return;
        if (element.scrollWidth > element.clientWidth + 2) wrappedAffordances.push(labelFor(element));
      });

      const hiddenContent = [];
      document.querySelectorAll("main h1, main h2, main article, main section").forEach((element) => {
        const style = getComputedStyle(element);
        if (style.display !== "none" && (style.visibility === "hidden" || Number(style.opacity) === 0)) {
          hiddenContent.push(labelFor(element));
        }
      });

      return {
        title: document.title,
        marker: Boolean(document.querySelector("main[data-public-surface='meetstaat']")),
        heading: document.querySelector("main h1")?.textContent?.trim().slice(0, 100) ?? "",
        overflowX: root.scrollWidth - root.clientWidth,
        wide: wide.slice(0, 12),
        ownOverflow: ownOverflow.slice(0, 12),
        smallTargets: smallTargets.slice(0, 12),
        wrappedAffordances: wrappedAffordances.slice(0, 12),
        hiddenContent: hiddenContent.slice(0, 12),
      };
    });

    if (!metrics.marker) fail(route, viewport, "missing-marker");
    if (!metrics.heading) fail(route, viewport, "missing-h1");
    if (metrics.overflowX !== 0) fail(route, viewport, "document-overflow", String(metrics.overflowX));
    if (metrics.wide.length) fail(route, viewport, "out-of-viewport", metrics.wide.join(" | "));
    if (metrics.ownOverflow.length) fail(route, viewport, "element-overflow", metrics.ownOverflow.join(" | "));
    if (metrics.smallTargets.length) fail(route, viewport, "small-target", metrics.smallTargets.join(" | "));
    if (metrics.wrappedAffordances.length) fail(route, viewport, "wrapped-affordance", metrics.wrappedAffordances.join(" | "));
    if (metrics.hiddenContent.length) fail(route, viewport, "reduced-motion-hidden", metrics.hiddenContent.join(" | "));
    const unexpectedConsoleErrors = consoleErrors.filter((message) => !/status of 405 \(Method Not Allowed\)/.test(message));
    if (unexpectedConsoleErrors.length) fail(route, viewport, "console-error", unexpectedConsoleErrors.slice(0, 5).join(" | "));
    if (pageErrors.length) fail(route, viewport, "page-error", pageErrors.slice(0, 5).join(" | "));

    records.push({ route, viewport, status, heading: metrics.heading, ok: failures.every((item) => item.route !== route || item.viewport !== viewport) });
    await page.close();
  }

  await context.close();
}

// Focused keyboard and click-through smoke checks run once at real mobile/desktop widths.
{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto(`${baseUrl}/`, { waitUntil: "domcontentloaded" });
  const menuTrigger = page.getByRole("button", { name: "Menu openen" });
  await menuTrigger.click();
  const mobileMenu = page.locator("[data-mobile-menu]");
  if (!(await mobileMenu.isVisible())) fail("/", "390x844", "mobile-menu", "menu did not open");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);
  if ((await menuTrigger.getAttribute("aria-expanded")) !== "false") {
    fail("/", "390x844", "mobile-menu", "Escape did not close menu");
  }

  await page.goto(`${baseUrl}/quiz/quick`, { waitUntil: "domcontentloaded" });
  const firstAnswer = page.getByRole("radio").first();
  if (await firstAnswer.count()) {
    await firstAnswer.focus();
    await page.keyboard.press("Enter");
    await page.waitForTimeout(300);
    const progress = await page.getByRole("progressbar").getAttribute("aria-valuenow");
    if (!progress || Number(progress) < 1) fail("/quiz/quick", "390x844", "quick-flow", "answer did not advance");
  } else {
    fail("/quiz/quick", "390x844", "quick-flow", "answer controls missing");
  }

  await page.goto(`${baseUrl}/contact`, { waitUntil: "domcontentloaded" });
  const submit = page.getByRole("button", { name: /verstuur bericht/i });
  if (!(await submit.count())) fail("/contact", "390x844", "form", "submit control missing");

  await context.close();
}

await browser.close();

const passed = records.filter((record) => record.ok).length;
console.log(JSON.stringify({ baseUrl, audited: records.length, passed, failures }, null, 2));
if (failures.length) process.exitCode = 1;
