import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const { chromium } = await import(pathToFileURL((process.env.PLAYWRIGHT_PATH || process.env.RUNNER_TEMP + "/portfolio-browser/node_modules/playwright/index.mjs")).href);
const origin = "http://127.0.0.1:3000";
const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", "3000"], {
  stdio: ["ignore", "pipe", "pipe"],
  env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
});
let serverOutput = "";
server.stdout.on("data", chunk => { serverOutput += chunk.toString(); });
server.stderr.on("data", chunk => { serverOutput += chunk.toString(); });
let browser;
const errors = [];
const failures = [];
async function revealPageForCapture(page) {
  const { total, step } = await page.evaluate(() => ({ total: document.documentElement.scrollHeight - window.innerHeight, step: window.innerHeight * 0.68 }));
  for (let top = 0; top < total; top += step) {
    await page.evaluate(top => window.scrollTo({ top, behavior: "instant" }), top);
    await page.waitForTimeout(120);
  }
  await page.evaluate(top => window.scrollTo({ top, behavior: "instant" }), total);
  await page.waitForTimeout(1000);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(1000);
}
await mkdir("artifacts", { recursive: true });
try {
  let started = false;
  for (let attempt = 0; attempt < 80; attempt++) {
    try {
      if ((await fetch(origin)).ok) { started = true; break; }
    } catch { /* Wait for the production server. */ }
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  assert.ok(started, "Production server failed to start: " + serverOutput);
  browser = await chromium.launch({ headless: true, args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  page.on("pageerror", error => errors.push(error.message));
  const routes = [
    "/", "/projects", "/about", "/expertise", "/playground", "/contact", "/resume", "/credits",
    "/projects/sevasetu-ai", "/projects/voice-ai-agent", "/projects/estateflow-crm",
    "/projects/travel-booking", "/projects/internal-docs-assistant", "/projects/doctorease",
  ];
  for (const route of routes) {
    const response = await page.goto(origin + route, { waitUntil: "networkidle" });
    assert.equal(response.status(), 200, "Route returned an error: " + route);
    assert.equal(await page.locator("main").count(), 1, "One main landmark: " + route);
    assert.equal(await page.locator("main h1").count(), 1, "One page heading: " + route);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    assert.equal(overflow, false, "Desktop horizontal overflow: " + route);
    if (["/about", "/projects", "/expertise", "/contact", "/projects/sevasetu-ai"].includes(route)) {
      await revealPageForCapture(page);
      await page.screenshot({ path: "artifacts/" + route.slice(1).replaceAll("/", "-") + "-desktop.png", fullPage: true });
    }
  }
  const missing = await page.goto(origin + "/projects/unknown-project", { waitUntil: "networkidle" });
  assert.equal(missing.status(), 404, "Unknown case study should return 404");
  await page.goto(origin, { waitUntil: "networkidle" });
  await page.locator('[data-scene-variant="hero"][data-scene-state="ready"]').waitFor({ timeout: 45000 });
  assert.equal(await page.locator('[data-scene-variant="hero"]').getAttribute("data-models-loaded"), "3", "All hero foliage models load");
  await page.mouse.move(1200, 500);
  await page.waitForTimeout(500);
  const heroParallaxAfter = await page.locator('[data-scene-variant="hero"] canvas').screenshot();
  const firstPointer = await page.locator(".forest-scene-hero").evaluate(el => el.style.getPropertyValue("--forest-pointer-x"));
  await page.mouse.move(300, 200);
  await page.waitForTimeout(500);
  assert.ok(!heroParallaxAfter.equals(await page.locator('[data-scene-variant="hero"] canvas').screenshot()), "Forest camera and foliage react to pointer motion");
  assert.notEqual(firstPointer, await page.locator(".forest-scene-hero").evaluate(el => el.style.getPropertyValue("--forest-pointer-x")), "Pointer input changes the forest parallax position");
  await revealPageForCapture(page);
  await page.screenshot({ path: "artifacts/home-desktop.png", fullPage: true });
  const preview = await page.screenshot({ type: "jpeg", quality: 50 });
  await writeFile("artifacts/home-preview.jpg", preview);
  console.log("PREVIEW_JPEG:" + preview.toString("base64"));

  await page.waitForFunction(() => document.documentElement.dataset.scrolling === "smooth");
  // Check interpolation after the forest has left view, isolating the scroller from software WebGL.
  await page.evaluate(() => window.scrollTo({ top: document.getElementById("selected-work").offsetTop + 200, behavior: "instant" }));
  await page.waitForTimeout(500);
  await page.mouse.move(700, 800);
  await page.mouse.wheel(0, 540);
  const scrollSamples = await page.evaluate(async () => {
    const samples = [];
    for (let i = 0; i < 9; i++) {
      await new Promise(resolve => requestAnimationFrame(resolve));
      samples.push(Math.round(window.scrollY));
    }
    return samples;
  });
  console.log("SCROLL_SAMPLES:" + JSON.stringify(scrollSamples));
  assert.ok(new Set(scrollSamples).size > 2, "Wheel scrolling interpolates across frames");
  await page.waitForFunction(() => !document.documentElement.classList.contains("lenis-scrolling"), undefined, { timeout: 10000 });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(500);
  await page.locator(".scroll-cue").click();
  await page.waitForFunction(() => !document.documentElement.classList.contains("lenis-scrolling"), undefined, { timeout: 10000 });
  const anchor = await page.locator("#selected-work").evaluate(element => ({ top: element.getBoundingClientRect().top, scrollY: window.scrollY, padding: getComputedStyle(document.documentElement).scrollPaddingTop, classes: document.documentElement.className }));
  console.log("ANCHOR_GEOMETRY:" + JSON.stringify(anchor));
  await page.screenshot({ path: "artifacts/anchor-settled.png" });
  if (anchor.top < 80 || anchor.top > 140) failures.push("Anchor retains the sticky-header offset after scrolling settles: " + anchor.top);
  await page.getByRole("button", { name: "Pause visual effects", exact: true }).click();
  await page.waitForFunction(() => document.documentElement.dataset.effects === "off" && document.documentElement.dataset.scrolling === "native");
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForFunction(() => window.scrollY === 0);
  // Let the offscreen scene's visibility callback and canvas compositing settle.
  await page.waitForTimeout(400);
  const heroCanvas = page.locator('[data-scene-variant="hero"] canvas');
  const stillHero = await heroCanvas.screenshot({ path: "artifacts/hero-paused-before.png" });
  await page.waitForTimeout(300);
  const stillHeroAfter = await heroCanvas.screenshot({ path: "artifacts/hero-paused-after.png" });
  assert.ok(stillHero.equals(stillHeroAfter), "Global pause stops automatic hero motion");
  await page.reload({ waitUntil: "networkidle" });
  await page.waitForFunction(() => document.documentElement.dataset.effects === "off");
  await page.getByRole("button", { name: "Enable visual effects", exact: true }).click();
  await page.waitForFunction(() => document.documentElement.dataset.scrolling === "smooth");

  await page.getByRole("button", { name: "Search pages and projects", exact: true }).click();
  await page.getByRole("textbox", { name: "Search pages and projects" }).fill("Voice AI");
  await page.locator("dialog").getByRole("link", { name: /Voice AI Agent/ }).click();
  await page.waitForURL("**/projects/voice-ai-agent");
  assert.ok(page.url().endsWith("/projects/voice-ai-agent"), "Command search navigates to case study");
  assert.equal(await page.locator("dialog").isVisible(), false, "Command search closes on navigation");

  await page.goto(origin + "/projects", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /Full stack/ }).click();
  assert.equal(await page.locator(".project-card").count(), 2, "Full-stack filter");
  await page.getByRole("searchbox", { name: "Search projects or technologies" }).fill("unmatched-technology");
  assert.equal(await page.locator(".project-card").count(), 0, "Search empty state");
  await page.getByRole("button", { name: "Reset filters" }).click();
  assert.equal(await page.locator(".project-card").count(), 6, "Reset restores collection");
  await page.getByRole("searchbox", { name: "Search projects or technologies" }).fill("FAISS");
  assert.equal(await page.locator(".project-card").count(), 2, "Technology search");

  await page.goto(origin + "/playground", { waitUntil: "networkidle" });
  await page.locator('[data-scene-variant="lab"][data-scene-state="ready"]').waitFor({ timeout: 45000 });
  assert.equal(await page.locator('[data-scene-variant="lab"]').getAttribute("data-models-loaded"), "3", "All realistic forest models load");
  await page.getByRole("button", { name: "Pause motion", exact: true }).click();
  const canvas = page.locator(".forest-scene-lab canvas");
  const before = await canvas.screenshot();
  await page.getByRole("button", { name: "Sunrise", exact: true }).click();
  assert.equal(await page.getByRole("button", { name: "Sunrise", exact: true }).getAttribute("aria-pressed"), "true");
  const after = await canvas.screenshot();
  assert.ok(!before.equals(after), "Lighting control changes rendered forest pixels");
  await page.getByRole("button", { name: "Fireflies", exact: true }).click();
  assert.equal(await page.getByRole("button", { name: "Fireflies", exact: true }).getAttribute("aria-pressed"), "false");
  const withoutFlies = await canvas.screenshot();
  assert.ok(!after.equals(withoutFlies), "Fireflies control changes rendered forest pixels");
  await page.getByRole("button", { name: "Forest mist", exact: true }).click();
  const withoutMist = await canvas.screenshot();
  assert.ok(!withoutFlies.equals(withoutMist), "Mist control changes rendered forest pixels");
  await canvas.focus();
  await page.keyboard.press("ArrowRight");
  const rotated = await canvas.screenshot();
  assert.ok(!withoutMist.equals(rotated), "Keyboard exploration changes rendered forest pixels");
  await page.getByRole("slider", { name: "Wind strength" }).focus();
  await page.keyboard.press("Home");
  assert.equal(await page.locator('output[for="forest-wind"]').textContent(), "Still", "Wind setting updates");
  await page.getByRole("button", { name: "Reset forest and controls" }).click();
  assert.equal(await page.getByRole("button", { name: "Moonlight", exact: true }).getAttribute("aria-pressed"), "true");
  assert.equal(await page.getByRole("button", { name: "Fireflies", exact: true }).getAttribute("aria-pressed"), "true");
  assert.equal(await page.getByRole("button", { name: "Forest mist", exact: true }).getAttribute("aria-pressed"), "true");
  assert.equal(await page.getByRole("slider", { name: "Wind strength" }).inputValue(), "0.8");
  await revealPageForCapture(page);
  await page.screenshot({ path: "artifacts/playground-desktop.png", fullPage: true });

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(origin + "/playground", { waitUntil: "networkidle" });
  await page.locator('[data-scene-state="ready"]').waitFor({ timeout: 45000 });
  assert.equal(await page.getByRole("button", { name: "Play motion", exact: true }).count(), 1, "Reduced motion starts paused");
  assert.equal(await page.locator("html").getAttribute("data-scrolling"), "native", "Reduced motion uses native scrolling");
  await page.screenshot({ path: "artifacts/playground-reduced.png", fullPage: true });
  const stillOne = await page.locator(".forest-scene-lab canvas").screenshot();
  await page.waitForTimeout(300);
  const stillTwo = await page.locator(".forest-scene-lab canvas").screenshot();
  assert.ok(stillOne.equals(stillTwo), "Reduced-motion forest remains still");
  await page.emulateMedia({ reducedMotion: "no-preference" });

  await page.goto(origin + "/contact", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Prepare email" }).click();
  assert.equal(await page.locator(".draft-feedback").count(), 0, "Empty contact form does not prepare a draft");
  await page.getByLabel("Your name").fill("Kai & Team");
  await page.getByLabel("Email address").fill("kai@example.com");
  await page.getByLabel("A little about your idea").fill("Let's build an AI tool & a useful interface.\nUnicode: नमस्ते");
  await page.getByRole("button", { name: "Prepare email" }).click();
  const href = await page.getByRole("link", { name: "Open email draft" }).getAttribute("href");
  const draft = new URL(href);
  assert.equal(draft.protocol, "mailto:");
  assert.equal(draft.pathname, "rahulkalagadda71@gmail.com");
  assert.equal(draft.searchParams.get("subject"), "AI engineering — Kai & Team");
  assert.ok(draft.searchParams.get("body").includes("Unicode: नमस्ते"), "Contact draft retains Unicode");
  assert.ok(draft.searchParams.get("body").includes("Reply to: kai@example.com"), "Contact draft includes reply address");
  assert.equal(draft.searchParams.size, 2, "Draft values cannot inject additional mail parameters");

  await page.getByRole("button", { name: "Switch to light theme" }).click();
  await page.reload({ waitUntil: "networkidle" });
  assert.equal(await page.locator("html").getAttribute("data-theme"), "light", "Theme persists across reload");
  await page.screenshot({ path: "artifacts/contact-light.png", fullPage: true });
  await page.getByRole("button", { name: "Switch to dark theme" }).click();

  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of routes) {
    await page.goto(origin + route, { waitUntil: "networkidle" });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1), false, "Mobile horizontal overflow: " + route);
  }
  await page.goto(origin, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Open navigation" }).click();
  await page.locator("#mobile-navigation").getByRole("link", { name: "About", exact: true }).click();
  await page.waitForURL("**/about");
  assert.ok(page.url().endsWith("/about"), "Mobile navigation changes page");
  assert.equal(await page.locator("#mobile-navigation").count(), 0, "Mobile navigation closes");
  await page.goto(origin, { waitUntil: "networkidle" });
  await page.locator('[data-scene-variant="hero"][data-scene-state="ready"]').waitFor({ timeout: 45000 });
  await revealPageForCapture(page);
  await page.screenshot({ path: "artifacts/home-mobile.png", fullPage: true });
  await page.goto(origin + "/playground", { waitUntil: "networkidle" });
  await page.locator('[data-scene-state="ready"]').waitFor({ timeout: 45000 });
  await page.screenshot({ path: "artifacts/playground-mobile.png", fullPage: true });
  const fallbackPage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await fallbackPage.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(type, ...args) {
      if (String(type).startsWith("webgl") || type === "experimental-webgl") return null;
      return original.call(this, type, ...args);
    };
  });
  await fallbackPage.goto(origin + "/playground", { waitUntil: "networkidle" });
  await fallbackPage.locator('[data-scene-state="fallback"]').waitFor({ timeout: 45000 });
  assert.equal(await fallbackPage.getByRole("status").isVisible(), true, "WebGL fallback keeps a readable forest and explanation");
  await fallbackPage.screenshot({ path: "artifacts/forest-fallback.png", fullPage: true });
  await fallbackPage.close();
  assert.deepEqual(errors, [], "No uncaught browser errors");
  assert.deepEqual(failures, [], "Motion behavior checks");
  console.log("PASS: 14 routes, 404, desktop/mobile overflow, command search, filters, contact encoding, theme persistence, three real foliage models, rendered forest lighting/fireflies/mist/keyboard controls, smooth wheel/anchors, global motion pause, reduced motion, WebGL fallback.");
} finally {
  await browser?.close();
  server.kill("SIGTERM");
}
