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
let mediaBrowser;
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
  // Isolate the film from GPU speed: test decoded video frames, native pinning, and reverse scrubbing.
  mediaBrowser = await chromium.launch({ channel: "chrome", headless: true, args: ["--disable-gpu"] });
  const disableWebGL = () => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(type, ...args) {
      if (String(type).startsWith("webgl") || type === "experimental-webgl") return null;
      return original.call(this, type, ...args);
    };
  };
  const filmPage = await mediaBrowser.newPage({ viewport: { width: 1280, height: 900 } });
  filmPage.on("pageerror", error => errors.push(error.message));
  await filmPage.addInitScript(disableWebGL);
  await filmPage.goto(origin, { waitUntil: "networkidle" });
  console.log("FILM_DIAGNOSTICS:" + JSON.stringify(await filmPage.locator("video").evaluate(v => ({ source:v.currentSrc, ready:v.readyState, error:v.error?.message, codec:v.canPlayType('video/mp4; codecs="avc1.42E01E"'), state:v.closest(".forest-journey").dataset.filmState }))));
  await filmPage.locator('.forest-journey[data-film-state="ready"]').waitFor({ timeout: 20000 });
  const film = filmPage.locator(".forest-journey-film");
  assert.ok((await film.getAttribute("src")).endsWith("/forest-journey.mp4"), "Desktop gets the desktop film");
  assert.equal(await film.evaluate(v => v.paused && !v.autoplay), true, "Film never autoplays or loops");
  const hashFrame = async targetPage => targetPage.evaluate(() => {
    const v = document.querySelector(".forest-journey-film");
    const c = document.createElement("canvas"); c.width = 64; c.height = 36;
    const ctx = c.getContext("2d"); ctx.drawImage(v, 0, 0, 64, 36);
    return Array.from(ctx.getImageData(0, 0, 64, 36).data).reduce((hash, value) => Math.imul(hash ^ value, 16777619) >>> 0, 2166136261);
  });
  const seekByScroll = async (targetPage, progress) => {
    await targetPage.evaluate(progress => {
      const root = document.querySelector(".forest-journey");
      const stage = root.querySelector(".forest-hero");
      const header = document.querySelector(".site-header").getBoundingClientRect().height;
      const start = window.scrollY + root.getBoundingClientRect().top - header;
      window.scrollTo({ top: start + (root.offsetHeight - stage.offsetHeight) * progress, behavior: "instant" });
    }, progress);
    await targetPage.waitForFunction(progress => {
      const v = document.querySelector(".forest-journey-film");
      const root = document.querySelector(".forest-journey");
      return !v.seeking && Math.abs(Number(root.dataset.journeyProgress) - progress) < .02 && Math.abs(v.currentTime - progress * (v.duration - 1 / 24)) < .15;
    }, progress, { timeout: 10000 });
  };
  const opening = await hashFrame(filmPage);
  await seekByScroll(filmPage, .55);
  const middle = await hashFrame(filmPage);
  assert.notEqual(opening, middle, "Scrolling changes actual decoded forest frames");
  const pinned = await filmPage.locator(".forest-hero").evaluate(el => el.getBoundingClientRect().top);
  const header = await filmPage.locator(".site-header").evaluate(el => el.getBoundingClientRect().height);
  assert.ok(Math.abs(pinned - header) < 2, "Hero stays pinned below the header");
  const stoppedTime = await film.evaluate(v => v.currentTime);
  await filmPage.waitForTimeout(400);
  assert.equal(await film.evaluate(v => v.currentTime), stoppedTime, "Film holds its exact frame when scrolling stops");
  await filmPage.screenshot({ path: "artifacts/hero-film-middle.png" });
  await seekByScroll(filmPage, .15);
  assert.ok(await film.evaluate(v => v.currentTime) < stoppedTime, "Scrolling backwards reverses the film");
  await seekByScroll(filmPage, .55);
  assert.equal(await hashFrame(filmPage), middle, "Revisiting the same scroll position returns the same film frame");
  await filmPage.getByRole("button", { name: "Pause visual effects", exact: true }).click();
  await filmPage.waitForFunction(() => document.querySelector(".forest-journey").dataset.journeyMotion === "off");
  assert.equal(await film.getAttribute("src"), null, "Global pause cancels video loading and restores the still forest");
  await filmPage.close();

  const phoneFilm = await mediaBrowser.newPage({ viewport: { width: 390, height: 844 } });
  phoneFilm.on("pageerror", error => errors.push(error.message));
  await phoneFilm.addInitScript(disableWebGL);
  await phoneFilm.goto(origin, { waitUntil: "networkidle" });
  await phoneFilm.locator('.forest-journey[data-film-state="ready"]').waitFor({ timeout: 20000 });
  assert.ok((await phoneFilm.locator("video").getAttribute("src")).endsWith("/forest-journey-mobile.mp4"), "Phone gets the smaller film");
  const phoneStart = await hashFrame(phoneFilm);
  await seekByScroll(phoneFilm, .6);
  assert.notEqual(await hashFrame(phoneFilm), phoneStart, "Phone scroll changes decoded forest frames");
  assert.equal(await phoneFilm.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, "Pinned phone hero fits the viewport");
  await phoneFilm.screenshot({ path: "artifacts/hero-film-phone.png" });
  await phoneFilm.emulateMedia({ reducedMotion: "reduce" });
  await phoneFilm.waitForFunction(() => document.querySelector(".forest-journey").dataset.journeyMotion === "off");
  assert.equal(await phoneFilm.locator("video").getAttribute("src"), null, "Reduced motion removes the film source");
  assert.equal(await phoneFilm.locator(".forest-hero").evaluate(el => getComputedStyle(el).position), "relative", "Reduced motion keeps normal page scrolling");
  await phoneFilm.close();

  const failedFilm = await mediaBrowser.newPage({ viewport: { width: 390, height: 844 } });
  failedFilm.on("pageerror", error => errors.push(error.message));
  await failedFilm.addInitScript(disableWebGL);
  await failedFilm.route("**/forest/forest-journey*.mp4", route => route.abort());
  await failedFilm.goto(origin, { waitUntil: "networkidle" });
  await failedFilm.locator('.forest-journey[data-film-state="fallback"]').waitFor({ timeout: 15000 });
  assert.equal(await failedFilm.locator(".forest-photo").evaluate(el => Number(getComputedStyle(el).opacity)), 1, "Failed film retains the original forest image");
  assert.equal(await failedFilm.getByRole("link", { name: "Explore my work", exact: true }).isVisible(), true, "Hero remains usable when film and WebGL are unavailable");
  await failedFilm.close();
  console.log("PASS: scroll-driven forest film, decoded frames, reverse scrubbing, sticky hero, idle frame hold, phone film, global pause, reduced motion, failed-video fallback.");

  // Observe native audio nodes and rendered samples; verify that controls affect real sound.
  const musicPage = await mediaBrowser.newPage({ viewport: { width: 1440, height: 1100 }, reducedMotion: "reduce" });
  musicPage.on("pageerror", error => errors.push(error.message));
  await musicPage.addInitScript(disableWebGL);
  await musicPage.addInitScript(() => {
    window.__forestContexts = [];
    window.__forestStarts = [];
    window.__forestScores = [];
    const NativeContext = window.AudioContext;
    window.AudioContext = class extends NativeContext {
      constructor(...args) { super(...args); window.__forestContexts.push(this); }
      createAnalyser() { const node = super.createAnalyser(); window.__forestAnalyser = node; return node; }
      createBufferSource() {
        const node = super.createBufferSource();
        const start = node.start.bind(node);
        node.start = (...args) => { window.__forestStarts.push({ offset: args[1] || 0, duration: node.buffer?.duration, loop: node.loop }); return start(...args); };
        return node;
      }
    };
    const render = OfflineAudioContext.prototype.startRendering;
    OfflineAudioContext.prototype.startRendering = async function(...args) {
      const buffer = await render.apply(this, args);
      const samples = buffer.getChannelData(0);
      let peak = 0; let sum = 0; let hash = 2166136261;
      for (let i = 0; i < samples.length; i++) { peak = Math.max(peak, Math.abs(samples[i])); sum += samples[i] * samples[i]; if (i % 50 === 0) hash = Math.imul(hash ^ Math.round(samples[i] * 32767), 16777619) >>> 0; }
      window.__forestScores.push({ duration: buffer.duration, peak, rms: Math.sqrt(sum / samples.length), hash });
      return buffer;
    };
    window.__forestRms = () => {
      if (!window.__forestAnalyser) return 0;
      const values = new Uint8Array(window.__forestAnalyser.fftSize);
      window.__forestAnalyser.getByteTimeDomainData(values);
      return Math.sqrt(Array.from(values).reduce((sum, value) => sum + Math.pow((value - 128) / 128, 2), 0) / values.length);
    };
  });
  await musicPage.goto(origin, { waitUntil: "networkidle" });
  assert.equal(await musicPage.evaluate(() => window.__forestContexts.length), 0, "Music does not create an audio context or autoplay on arrival");
  const room = musicPage.locator("#listening-room");
  await musicPage.locator("#field-notes details summary").first().focus();
  await musicPage.keyboard.press("Enter");
  assert.equal(await musicPage.locator("#field-notes details").first().getAttribute("open"), "", "Field notes can be expanded with a keyboard");
  await musicPage.locator("#portfolio-questions summary").nth(1).click();
  assert.equal(await musicPage.locator("#portfolio-questions").getByRole("link", { name: "Compare projects" }).isVisible(), true, "FAQ reveals useful navigation");
  await room.getByRole("button", { name: "Play music", exact: true }).click();
  await room.locator('[data-audio-state="playing"]').waitFor({ timeout: 20000 });
  await musicPage.waitForFunction(() => window.__forestRms() > .002, undefined, { timeout: 10000 });
  const volume = room.getByRole("slider", { name: "Music volume", exact: true });
  await volume.focus();
  await musicPage.keyboard.press("Home");
  assert.equal(await room.locator(".music-volume output").textContent(), "0%", "Volume supports keyboard adjustment");
  await musicPage.waitForFunction(() => window.__forestRms() < .001);
  await musicPage.keyboard.press("End");
  assert.equal(await room.locator(".music-volume output").textContent(), "100%");
  await musicPage.waitForFunction(() => window.__forestRms() > .002);
  await room.getByRole("button", { name: "Mute music", exact: true }).click();
  await musicPage.waitForFunction(() => window.__forestRms() < .001);
  assert.equal(await room.locator(".music-volume output").textContent(), "Muted", "Mute changes both sound and its visible state");
  await room.getByRole("button", { name: "Unmute music", exact: true }).click();
  await musicPage.waitForFunction(() => window.__forestRms() > .002);
  const playhead = room.getByRole("slider", { name: "Playback position", exact: true });
  await playhead.focus();
  await musicPage.keyboard.press("Home");
  await room.locator('[data-audio-state="playing"]').waitFor();
  await musicPage.keyboard.press("PageUp");
  await room.locator('[data-audio-state="playing"]').waitFor();
  const seekStart = await musicPage.evaluate(() => window.__forestStarts.at(-1));
  assert.ok(seekStart.offset > 6 && seekStart.offset < 9, "Seeking changes the native audio source's offset");
  assert.equal(seekStart.duration, 72, "The actual score matches the displayed duration");
  assert.equal(seekStart.loop, true, "The actual audio source loops");
  await room.getByRole("button", { name: "Pause music", exact: true }).click();
  await musicPage.waitForFunction(() => window.__forestContexts.at(-1).state === "suspended");
  const pausedPosition = await playhead.inputValue();
  await musicPage.waitForTimeout(400);
  assert.equal(await playhead.inputValue(), pausedPosition, "Pause holds the playhead and suspends the audio context");
  await room.getByRole("button", { name: "Play music", exact: true }).click();
  await room.locator('[data-audio-state="playing"]').waitFor();
  await room.getByRole("button", { name: "Next music track" }).click();
  await room.locator('[data-track="moonlight"][data-audio-state="playing"]').waitFor({ timeout: 20000 });
  await room.getByRole("button", { name: "Next music track" }).click();
  await room.locator('[data-track="first-light"][data-audio-state="playing"]').waitFor({ timeout: 20000 });
  const scores = await musicPage.evaluate(() => window.__forestScores);
  assert.equal(new Set(scores.map(score => score.hash)).size, 3, "Each soundtrack has distinct rendered audio");
  assert.ok(scores.every(score => score.peak < 1 && score.rms > .01), "Scores have audible content without clipped samples");
  console.log("MUSIC_DIAGNOSTICS:" + JSON.stringify(scores));
  await musicPage.emulateMedia({ reducedMotion: "no-preference" });
  await musicPage.waitForFunction(() => document.documentElement.dataset.effects === "on");
  assert.equal(await room.locator(".music-record").evaluate(node => getComputedStyle(node).animationPlayState), "running", "The record rotates during playback");
  await musicPage.getByRole("button", { name: "Pause visual effects", exact: true }).click();
  await musicPage.waitForFunction(() => document.documentElement.dataset.effects === "off");
  assert.equal(await room.locator(".music-record").evaluate(node => getComputedStyle(node).animationPlayState), "paused", "Visual pause stops record animation");
  assert.equal(await room.locator(".listening-panel").getAttribute("data-audio-state"), "playing", "Visual preference preserves explicitly requested music");
  await room.screenshot({ path: "artifacts/listening-room-desktop.png", animations: "disabled" });
  await musicPage.locator("#field-notes").screenshot({ path: "artifacts/field-notes-desktop.png" });
  await musicPage.locator("header").getByRole("link", { name: "Projects", exact: true }).click();
  await musicPage.waitForURL("**/projects");
  const dock = musicPage.getByRole("complementary", { name: "Music player", exact: true });
  await dock.locator(".music-dock-heading strong").waitFor();
  assert.equal(await dock.getAttribute("data-audio-state"), "playing", "Music and its controls survive client-side route navigation");
  assert.equal(await musicPage.evaluate(() => window.__forestContexts.length), 1, "Route navigation reuses the active audio context");
  await dock.getByRole("button", { name: "Previous music track" }).click();
  await musicPage.locator('.music-dock[data-track="moonlight"][data-audio-state="playing"]').waitFor({ timeout: 20000 });
  await musicPage.setViewportSize({ width: 390, height: 844 });
  assert.equal(await musicPage.evaluate(() => document.documentElement.scrollWidth > innerWidth + 1), false, "Phone music player fits the viewport");
  await dock.screenshot({ path: "artifacts/music-dock-mobile.png" });
  await dock.getByRole("button", { name: "Minimize music player" }).click();
  assert.equal(await dock.isVisible(), false, "Music controls can be minimized");
  assert.equal(await musicPage.evaluate(() => document.activeElement?.id), "music-launcher", "Minimize restores keyboard focus to the launcher");
  await musicPage.getByRole("button", { name: "Open music player" }).click();
  await dock.getByRole("button", { name: "Pause music" }).click();
  await musicPage.reload({ waitUntil: "networkidle" });
  assert.equal(await musicPage.evaluate(() => window.__forestContexts.length), 0, "Saved preferences never restart music automatically");
  await musicPage.getByRole("button", { name: "Open music player" }).click();
  assert.equal(await dock.getAttribute("data-track"), "moonlight", "The selected soundtrack persists after reload");
  assert.equal(await dock.getByRole("slider", { name: "Music volume" }).inputValue(), "100", "The volume preference persists after reload");
  await dock.getByRole("button", { name: "Minimize music player" }).click();
  await musicPage.goto(origin, { waitUntil: "networkidle" });
  await musicPage.locator("#listening-room").screenshot({ path: "artifacts/listening-room-mobile.png", animations: "disabled" });
  await musicPage.close();
  console.log("PASS: native music output, three distinct scores, no autoplay, volume/mute, seeking, pause/resume, playlist, route continuity, preferences, mobile dock, motion controls, field notes and FAQ.");


  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 }, reducedMotion: "reduce" });
  page.on("pageerror", error => errors.push(error.message));
  const routes = [
    "/", "/projects", "/projects/compare", "/about", "/expertise", "/playground", "/contact", "/resume", "/credits",
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
    if (["/about", "/projects", "/projects/compare", "/expertise", "/contact", "/projects/sevasetu-ai"].includes(route)) {
      await revealPageForCapture(page);
      await page.screenshot({ path: "artifacts/" + route.slice(1).replaceAll("/", "-") + "-desktop.png", fullPage: true });
    }
  }
  const missing = await page.goto(origin + "/projects/unknown-project", { waitUntil: "networkidle" });
  assert.equal(missing.status(), 404, "Unknown case study should return 404");
  await page.emulateMedia({ reducedMotion: "no-preference" });
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
  // Record in the page from the wheel event itself; protocol latency must not miss the animation.
  await page.evaluate(() => {
    window.__wheelSamples = [];
    window.__wheelFrameTimes = [];
    window.__wheelSampleDone = false;
    window.addEventListener("wheel", () => {
      window.__wheelSamples.push(Math.round(window.scrollY));
      window.__wheelFrameTimes.push(Math.round(performance.now()));
      const capture = () => {
        window.__wheelSamples.push(Math.round(window.scrollY));
        window.__wheelFrameTimes.push(Math.round(performance.now()));
        if (window.__wheelSamples.length < 16) requestAnimationFrame(capture);
        else window.__wheelSampleDone = true;
      };
      requestAnimationFrame(capture);
    }, { once: true, passive: true });
  });
  await page.mouse.move(700, 850);
  await page.mouse.wheel(0, 540);
  await page.waitForFunction(() => window.__wheelSampleDone);
  const scrollSamples = await page.evaluate(() => window.__wheelSamples);
  console.log("SCROLL_SAMPLES:" + JSON.stringify(scrollSamples));
  console.log("SCROLL_FRAME_TIMES:" + JSON.stringify(await page.evaluate(() => window.__wheelFrameTimes)));
  assert.ok(new Set(scrollSamples).size > 2, "Wheel scrolling interpolates across frames with the forest active");
  await page.waitForFunction(() => !document.documentElement.classList.contains("lenis-scrolling"), undefined, { timeout: 30000 });
  await page.locator(".scroll-cue").click();
  try {
    await page.waitForFunction(() => {
      const top = document.getElementById("selected-work").getBoundingClientRect().top;
      if (Math.abs(top - 110) > 2) { window.__anchorStableSince = 0; return false; }
      if (!window.__anchorStableSince) window.__anchorStableSince = performance.now();
      return performance.now() - window.__anchorStableSince > 300;
    }, undefined, { timeout: 30000 });
  } catch {
    failures.push("Trail anchor did not settle at the header offset");
  }
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
  await heroCanvas.screenshot({ path: "artifacts/hero-paused-before.png" });
  const pausedRenderCount = await heroCanvas.getAttribute("data-render-count");
  await page.waitForTimeout(300);
  await heroCanvas.screenshot({ path: "artifacts/hero-paused-after.png" });
  assert.equal(await heroCanvas.getAttribute("data-render-count"), pausedRenderCount, "Global pause stops automatic hero rendering");
  console.log("PAUSED_HERO_RENDER_COUNT:" + pausedRenderCount);
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

  await page.getByRole("link", { name: "Compare projects", exact: true }).click();
  await page.waitForURL("**/projects/compare*");
  assert.equal(await page.locator(".comparison-project").count(), 2, "Comparison starts with AI and full-stack projects");
  const choose = page.getByRole("group", { name: "Choose projects to compare" });
  await choose.getByRole("button", { name: /Voice AI Agent/ }).click();
  assert.equal(await page.locator(".comparison-project").count(), 3, "A third project can be added");
  assert.equal(await choose.getByRole("button", { name: /DoctorEase/ }).isDisabled(), true, "Comparison is limited to three projects");
  await choose.getByRole("button", { name: /EstateFlow CRM/ }).click();
  await choose.getByRole("button", { name: /DoctorEase/ }).click();
  await page.waitForFunction(() => new URLSearchParams(location.search).get("selection") === "sevasetu-ai,voice-ai-agent,doctorease");
  await page.reload({ waitUntil: "networkidle" });
  assert.deepEqual(await page.locator(".comparison-project h3").allTextContents(), ["SevaSetu AI", "Voice AI Agent", "DoctorEase"], "A shared comparison restores the selected projects in order");
  await page.context().grantPermissions(["clipboard-read", "clipboard-write"], { origin });
  await page.getByRole("button", { name: "Copy comparison link" }).click();
  await page.getByRole("status").filter({ hasText: "Comparison link copied." }).waitFor();
  assert.equal(await page.evaluate(() => navigator.clipboard.readText()), page.url(), "The copied comparison link preserves the selection");
  await revealPageForCapture(page);
  await page.screenshot({ path: "artifacts/comparison-three-desktop.png", fullPage: true });
  await page.getByRole("button", { name: "Reset selection" }).click();
  await choose.getByRole("button", { name: /SevaSetu AI/ }).click();
  await choose.getByRole("button", { name: /EstateFlow CRM/ }).click();
  assert.equal(await page.locator(".comparison-empty").count(), 1, "Removing every project shows a useful empty state");
  await page.getByRole("button", { name: "Start with AI + full stack" }).click();
  assert.equal(await page.locator(".comparison-project").count(), 2, "Empty state restores an initial collection");
  await page.goto(origin + "/projects/compare?selection=invalid,voice-ai-agent,voice-ai-agent", { waitUntil: "networkidle" });
  assert.deepEqual(await page.locator(".comparison-project h3").allTextContents(), ["Voice AI Agent"], "Shared selections ignore invalid and duplicate projects");

  await page.goto(origin + "/projects/voice-ai-agent", { waitUntil: "networkidle" });
  const architecture = page.locator(".architecture-explorer");
  await architecture.getByRole("tab").first().focus();
  await page.keyboard.press("End");
  assert.equal(await architecture.getByRole("tab", { selected: true }).locator("strong").textContent(), "Speech output", "End selects the final architecture stage");
  assert.equal(await architecture.getByRole("button", { name: "Next architecture stage" }).isDisabled(), true, "Architecture does not advance past its final stage");
  await page.keyboard.press("Home");
  assert.equal(await architecture.getByRole("tab", { selected: true }).locator("strong").textContent(), "Audio input", "Home selects the first architecture stage");
  await page.keyboard.press("ArrowRight");
  assert.equal(await architecture.getByRole("tabpanel").locator("h3").textContent(), "Transcription.", "Arrow keys update the project-specific stage detail");
  await architecture.getByRole("button", { name: "Next architecture stage" }).click();
  assert.equal(await architecture.locator(".architecture-stage-description").textContent(), "Knowledge context and response generation", "Next shows the selected stage's repository-backed detail");
  assert.equal(await architecture.locator(".architecture-map-node.is-active").count(), 1, "The system illustration highlights one current stage");
  await architecture.screenshot({ path: "artifacts/architecture-voice-desktop.png" });
  await page.getByRole("link", { name: "Compare this project" }).click();
  await page.waitForURL("**/projects/compare*");
  await page.waitForFunction(() => document.querySelector(".comparison-project h3")?.textContent === "Voice AI Agent");
  assert.deepEqual(await page.locator(".comparison-project h3").allTextContents(), ["Voice AI Agent", "EstateFlow CRM"], "Case study comparison starts with the current project");

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
  await page.locator(".forest-scene-lab canvas").screenshot();
  const reducedRenderCount = await page.locator(".forest-scene-lab canvas").getAttribute("data-render-count");
  await page.waitForTimeout(300);
  await page.locator(".forest-scene-lab canvas").screenshot();
  assert.equal(await page.locator(".forest-scene-lab canvas").getAttribute("data-render-count"), reducedRenderCount, "Reduced motion stops automatic forest rendering");
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
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    if (overflow) {
      const suspects = await page.evaluate(() => Array.from(document.querySelectorAll("main *")).map(el => ({ tag: el.tagName, class: String(el.className), right: el.getBoundingClientRect().right, left: el.getBoundingClientRect().left })).filter(el => el.right > window.innerWidth + 1 || el.left < -1).slice(0, 15));
      console.log("MOBILE_OVERFLOW:" + JSON.stringify({ route, suspects }));
      await page.screenshot({ path: "artifacts/overflow-" + route.replaceAll("/", "-") + ".png", fullPage: true });
      failures.push("Mobile horizontal overflow: " + route);
    }
  }
  await page.goto(origin + "/projects/compare?selection=sevasetu-ai,voice-ai-agent,doctorease", { waitUntil: "networkidle" });
  assert.equal(await page.locator(".comparison-project").count(), 3, "Phone comparison retains all selected projects");
  const comparisonColumns = await page.locator(".comparison-grid").evaluate(element => getComputedStyle(element).gridTemplateColumns.trim().split(/\s+/).length);
  assert.equal(comparisonColumns, 1, "Phone comparison stacks projects into one readable column");
  await revealPageForCapture(page);
  await page.screenshot({ path: "artifacts/comparison-mobile.png", fullPage: true });
  await page.goto(origin + "/projects/voice-ai-agent", { waitUntil: "networkidle" });
  await page.locator(".architecture-explorer").getByRole("tab").last().click();
  await page.locator(".architecture-explorer").screenshot({ path: "artifacts/architecture-voice-mobile.png" });
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
  assert.equal(await fallbackPage.locator(".forest-fallback[role='status']").isVisible(), true, "WebGL fallback keeps a readable forest and explanation");
  await fallbackPage.screenshot({ path: "artifacts/forest-fallback.png", fullPage: true });
  await fallbackPage.close();


  assert.deepEqual(errors, [], "No uncaught browser errors");
  assert.deepEqual(failures, [], "Motion behavior checks");
  console.log("PASS: 15 routes, 404, desktop/mobile overflow, project comparison and shared links, keyboard architecture walkthroughs, command search, filters, contact encoding, theme persistence, three real foliage models, rendered forest lighting/fireflies/mist/keyboard controls, smooth wheel/anchors, global motion pause, reduced motion, WebGL fallback.");
} finally {
  await mediaBrowser?.close();
  await browser?.close();
  server.kill("SIGTERM");
}
