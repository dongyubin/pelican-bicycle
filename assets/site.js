/* Pelican Bicycle Benchmark — site behaviour */
(() => {
  "use strict";

  const docEl = document.documentElement;
  docEl.classList.add("js");

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  /* ---------- Navigation ---------- */
  const header = $(".site-header");
  const navToggle = $(".nav-toggle");
  if (header && navToggle) {
    navToggle.addEventListener("click", () => {
      const open = header.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? navToggle.dataset.closeLabel : navToggle.dataset.openLabel);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && header.classList.contains("is-open")) {
        header.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.focus();
      }
    });
  }

  /* ---------- Copy to clipboard ---------- */
  $$("[data-copy-target]").forEach((button) => {
    button.addEventListener("click", async () => {
      const target = $(button.dataset.copyTarget);
      if (!target) return;
      const text = target.textContent.replace(/\s+/g, " ").trim();
      let copied = false;
      try {
        await navigator.clipboard.writeText(text);
        copied = true;
      } catch {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        try {
          copied = document.execCommand("copy");
        } catch {
          copied = false;
        }
        ta.remove();
      }
      if (!copied) return;
      const original = button.textContent;
      button.textContent = button.dataset.copied || "Copied";
      button.classList.add("is-copied");
      window.setTimeout(() => {
        button.textContent = original;
        button.classList.remove("is-copied");
      }, 1800);
    });
  });

  /* ---------- Reveal on scroll ---------- */
  const reveals = $$(".reveal");
  if (reveals.length) {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      reveals.forEach((el) => el.classList.add("is-in"));
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-in");
              observer.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -6% 0px", threshold: 0.05 }
      );
      reveals.forEach((el) => observer.observe(el));
      window.setTimeout(() => reveals.forEach((el) => el.classList.add("is-in")), 2600);
    }
  }

  /* ---------- Single-run player ---------- */
  $$("[data-run]").forEach((frame) => {
    const playBtn = $("[data-play]", frame);
    const loading = $("[data-loading]", frame);
    const source = frame.dataset.src;
    const title = frame.dataset.title || "Model animation";
    const reloadBtn = document.querySelector(`[data-reload-for="${frame.id}"]`);
    let iframe = null;

    const loadIframe = () => {
      if (!iframe) {
        iframe = document.createElement("iframe");
        iframe.title = title;
        iframe.loading = "eager";
        iframe.setAttribute("scrolling", "no");
        iframe.setAttribute("referrerpolicy", "no-referrer");
        frame.appendChild(iframe);
      }
      if (loading) loading.hidden = false;
      iframe.addEventListener(
        "load",
        () => {
          if (loading) loading.hidden = true;
          frame.classList.add("is-playing");
          if (playBtn) playBtn.hidden = true;
          if (reloadBtn) reloadBtn.hidden = false;
        },
        { once: true }
      );
      iframe.src = `${source}${source.includes("?") ? "&" : "?"}run=${Date.now()}`;
    };

    if (playBtn) playBtn.addEventListener("click", loadIframe);

    if (reloadBtn) {
      reloadBtn.addEventListener("click", () => {
        const current = $("iframe", frame);
        if (!current) {
          loadIframe();
          return;
        }
        if (loading) loading.hidden = false;
        current.addEventListener(
          "load",
          () => {
            if (loading) loading.hidden = true;
          },
          { once: true }
        );
        current.src = `${source}${source.includes("?") ? "&" : "?"}run=${Date.now()}`;
      });
    }
  });

  /* ---------- Compare harness ---------- */
  const compareRoot = $("[data-compare]");
  if (!compareRoot) return;

  const modelDataEl = $("#pb-model-data");
  const labelsEl = $("#pb-compare-labels");
  if (!modelDataEl) return;

  let models = [];
  let labels = {};
  try {
    models = JSON.parse(modelDataEl.textContent);
    labels = labelsEl ? JSON.parse(labelsEl.textContent) : {};
  } catch {
    return;
  }

  const bySlug = new Map(models.map((model) => [model.slug, model]));
  const stage = $("[data-lanes]", compareRoot);
  const inputs = $$('input[name="lane"]', compareRoot);
  const startBtn = $("[data-start]", compareRoot);
  const pauseBtn = $("[data-pause]", compareRoot);
  const resumeBtn = $("[data-resume]", compareRoot);
  const restartBtn = $("[data-restart]", compareRoot);
  const clockEl = $("[data-clock]", compareRoot);
  const statusEl = $("[data-status]", compareRoot);
  const statusText = $("[data-status-text]", compareRoot);
  const countdownEl = $("[data-countdown]", compareRoot);
  const countdownText = countdownEl ? $("span", countdownEl) : null;
  const errorEl = $("[data-compare-error]", compareRoot);
  const pickerMsg = $("[data-picker-msg]", compareRoot);
  const picker = $("[data-picker]", compareRoot);

  const MIN = Number(compareRoot.dataset.min || 2);
  const MAX = Number(compareRoot.dataset.max || models.length);
  const REDUCE = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let selected = [];
  let lanes = [];
  let state = "ready";
  let busy = false;
  let clockRunning = false;
  let clockStart = 0;
  let clockAccum = 0;
  let clockRaf = 0;
  let runToken = 0;

  const defaults = (compareRoot.dataset.defaults || "")
    .split(",")
    .map((slug) => slug.trim())
    .filter((slug) => bySlug.has(slug));

  const query = new URLSearchParams(window.location.search);
  const fromQuery = (query.get("runs") || "")
    .split(",")
    .map((slug) => slug.trim())
    .filter((slug) => bySlug.has(slug));

  selected = (fromQuery.length >= MIN ? fromQuery : defaults).slice(0, MAX);
  if (selected.length < MIN) selected = models.slice(0, MIN).map((model) => model.slug);

  inputs.forEach((input) => {
    input.checked = selected.includes(input.value);
  });

  const label = (key, fallback) => labels[key] || fallback;
  const escapeHtml = (value) =>
    String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;");

  function updateUrl() {
    const url = new URL(window.location.href);
    url.searchParams.set("runs", selected.join(","));
    window.history.replaceState(null, "", url);
  }

  function formatClock(ms) {
    const total = Math.max(0, ms);
    const minutes = Math.floor(total / 60000);
    const seconds = Math.floor((total % 60000) / 1000);
    const tenths = Math.floor((total % 1000) / 100);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${tenths}`;
  }

  function renderClock() {
    if (clockEl) clockEl.textContent = formatClock(clockAccum);
  }

  function tickClock() {
    if (!clockRunning) return;
    const elapsed = clockAccum + (performance.now() - clockStart);
    if (clockEl) clockEl.textContent = formatClock(elapsed);
    clockRaf = requestAnimationFrame(tickClock);
  }

  function startClock() {
    if (clockRunning) return;
    clockStart = performance.now();
    clockRunning = true;
    clockRaf = requestAnimationFrame(tickClock);
  }

  function stopClock() {
    if (!clockRunning) return;
    clockAccum += performance.now() - clockStart;
    clockRunning = false;
    cancelAnimationFrame(clockRaf);
    clockRaf = 0;
    renderClock();
  }

  function resetClock() {
    clockRunning = false;
    cancelAnimationFrame(clockRaf);
    clockRaf = 0;
    clockAccum = 0;
    renderClock();
  }

  function setState(next) {
    state = next;
    if (statusEl) {
      statusEl.classList.remove("is-racing", "is-paused");
      if (next === "racing") statusEl.classList.add("is-racing");
      if (next === "paused") statusEl.classList.add("is-paused");
    }
    if (statusText) {
      const key = next === "error" ? "ready" : next;
      statusText.textContent = label(key, next);
    }
    if (startBtn) {
      startBtn.hidden = next !== "ready" && next !== "error";
      startBtn.disabled = selected.length < MIN;
    }
    if (pauseBtn) pauseBtn.hidden = next !== "racing";
    if (resumeBtn) resumeBtn.hidden = next !== "paused";
    if (restartBtn) restartBtn.hidden = !(next === "racing" || next === "paused");
    if (errorEl) errorEl.hidden = next !== "error";
    const locked = next === "loading" || next === "countdown";
    inputs.forEach((input) => {
      input.disabled = locked;
    });
    if (picker) {
      picker.style.opacity = locked ? "0.6" : "";
    }
  }

  function renderPickerMessage(extra) {
    if (!pickerMsg) return;
    if (extra) {
      pickerMsg.textContent = extra;
      return;
    }
    pickerMsg.textContent = label("pickerHint", compareRoot.dataset.hint || "");
  }

  function lanePoster(model) {
    return `<img src="${escapeHtml(model.poster)}" alt="${escapeHtml(model.name)} — pelican bicycle animation poster" loading="lazy" width="1200" height="750">`;
  }

  function laneMarkup(model) {
    return `<article class="lane" data-slug="${escapeHtml(model.slug)}" style="--accent:${escapeHtml(model.accent)}">
      <header class="lane-head">
        <span class="lane-bib">${escapeHtml(model.bib)}</span>
        <div>
          <h3>${escapeHtml(model.name)}</h3>
          <small>${escapeHtml(model.vendor)}</small>
        </div>
        <span class="lane-total">${escapeHtml(model.total)}</span>
      </header>
      <div class="lane-frame">
        ${lanePoster(model)}
        <div class="lane-idle">
          <strong>${escapeHtml(label("idle", "Ready"))}</strong>
          <span>${escapeHtml(label("idleHint", "Press start"))}</span>
        </div>
      </div>
    </article>`;
  }

  function renderLanes() {
    if (!stage) return;
    stage.innerHTML = selected.map((slug) => laneMarkup(bySlug.get(slug))).join("");
    lanes = selected.map((slug) => ({
      model: bySlug.get(slug),
      el: $(`.lane[data-slug="${slug}"]`, stage),
      iframe: null,
    }));
    // Restore already-mounted iframes after a pause? Only used on (re)build, so reset is expected.
  }

  function getDoc(lane) {
    if (!lane.iframe) return null;
    try {
      return lane.iframe.contentDocument || lane.iframe.contentWindow.document;
    } catch {
      return null;
    }
  }

  function getAnimations(lane) {
    const doc = getDoc(lane);
    if (!doc) return [];
    try {
      return doc.getAnimations();
    } catch {
      return [];
    }
  }

  function pauseNative(lane, wantPaused) {
    const doc = getDoc(lane);
    if (!doc) return false;
    const button = doc.querySelector("#pauseBtn, #btnPause, #toggle");
    if (!button) return false;
    const pausedNow =
      /继续/.test(button.textContent || "") ||
      /播放/.test(button.getAttribute("aria-label") || "") ||
      button.getAttribute("aria-pressed") === "true";
    if (pausedNow !== wantPaused) {
      try {
        button.click();
      } catch {
        return false;
      }
      return true;
    }
    return true;
  }

  /* Runs whose motion is driven by requestAnimationFrame ignore WAAPI entirely,
     so the lane gates the child window's rAF queue instead. */
  function installRafGate(lane) {
    let win = null;
    try {
      win = lane.iframe && lane.iframe.contentWindow;
    } catch {
      return;
    }
    if (!win || win.__pelicanRafGate) return;
    const gate = {
      paused: false,
      seq: 0,
      pending: new Map(),
      real: new Map(),
      original: win.requestAnimationFrame.bind(win),
      cancel: win.cancelAnimationFrame.bind(win),
    };
    win.__pelicanRafGate = gate;
    win.requestAnimationFrame = (callback) => {
      gate.seq += 1;
      const id = gate.seq;
      if (gate.paused) gate.pending.set(id, callback);
      else gate.real.set(id, gate.original(callback));
      return id;
    };
    win.cancelAnimationFrame = (id) => {
      if (gate.pending.delete(id)) return;
      const realId = gate.real.get(id);
      if (realId !== undefined) {
        gate.cancel(realId);
        gate.real.delete(id);
      }
    };
  }

  function setRafPaused(lane, wantPaused) {
    let gate = null;
    try {
      gate = lane.iframe && lane.iframe.contentWindow.__pelicanRafGate;
    } catch {
      return false;
    }
    if (!gate) return false;
    if (gate.paused === wantPaused) return true;
    gate.paused = wantPaused;
    if (!wantPaused) {
      const queued = [...gate.pending.entries()];
      gate.pending.clear();
      for (const [id, callback] of queued) {
        try {
          gate.real.set(id, gate.original(callback));
        } catch {
          /* ignore */
        }
      }
    }
    return true;
  }

  function prepareLane(lane) {
    if (lane.model.control === "button" && pauseNative(lane, true)) return;
    if (lane.model.control === "raf") setRafPaused(lane, true);
    const animations = getAnimations(lane);
    for (const animation of animations) {
      try {
        animation.pause();
        animation.currentTime = 0;
      } catch {
        /* A control-less CSS animation can still be prepared via WAAPI. */
      }
    }
  }

  function playLane(lane) {
    if (lane.model.control === "button" && pauseNative(lane, false)) return;
    if (lane.model.control === "raf") setRafPaused(lane, false);
    const animations = getAnimations(lane);
    for (const animation of animations) {
      try {
        animation.play();
      } catch {
        /* ignore */
      }
    }
  }

  function pauseLane(lane) {
    if (lane.model.control === "button" && pauseNative(lane, true)) return;
    if (lane.model.control === "raf") setRafPaused(lane, true);
    const animations = getAnimations(lane);
    for (const animation of animations) {
      try {
        animation.pause();
      } catch {
        /* ignore */
      }
    }
  }

  function waitForLoad(iframe, timeout = 9000) {
    return new Promise((resolve) => {
      let settled = false;
      const done = () => {
        if (settled) return;
        settled = true;
        resolve();
      };
      iframe.addEventListener("load", done, { once: true });
      window.setTimeout(done, timeout);
    });
  }

  async function mountAll() {
    const loads = [];
    for (const lane of lanes) {
      const frame = $(".lane-frame", lane.el);
      if (!frame) continue;
      const old = $("iframe", frame);
      if (old) old.remove();
      const loading = document.createElement("div");
      loading.className = "lane-loading";
      loading.textContent = label("loading", "Loading runs…");
      frame.appendChild(loading);
      const iframe = document.createElement("iframe");
      iframe.title = `${lane.model.name} — original model animation`;
      iframe.loading = "eager";
      iframe.setAttribute("scrolling", "no");
      iframe.setAttribute("referrerpolicy", "no-referrer");
      lane.iframe = iframe;
      const loaded = waitForLoad(iframe);
      iframe.src = `${lane.model.artifact}?sync=${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      frame.appendChild(iframe);
      loads.push(
        loaded.then(() => {
          loading.remove();
          // Kimi's pause pill sits under its own SVG at lane widths, leaving a clipped sliver.
          const doc = iframe.contentDocument;
          if (doc) {
            const style = doc.createElement("style");
            style.textContent = ".control{display:none!important}";
            doc.head?.appendChild(style);
          }
          if (lane.model.control === "raf") installRafGate(lane);
        })
      );
    }
    await Promise.all(loads);
    await sleep(80);
  }

  async function countdown() {
    if (!countdownEl || !countdownText) return;
    countdownEl.hidden = false;
    const steps = REDUCE ? 1 : 3;
    for (let i = steps; i > 0; i -= 1) {
      countdownText.textContent = String(i);
      countdownText.classList.remove("pop");
      void countdownText.offsetWidth;
      countdownText.classList.add("pop");
      await sleep(REDUCE ? 350 : 680);
    }
    countdownText.textContent = label("go", "GO");
    countdownText.classList.remove("pop");
    void countdownText.offsetWidth;
    countdownText.classList.add("pop");
    await sleep(REDUCE ? 250 : 420);
    countdownEl.hidden = true;
  }

  async function sequence() {
    if (busy || !lanes.length) return;
    if (selected.length < MIN) {
      renderPickerMessage(label("pickMore", `Select at least ${MIN} runs.`));
      return;
    }
    busy = true;
    countdownEl && (countdownEl.hidden = true);
    resetClock();
    setState("loading");
    const token = ++runToken;
    try {
      await mountAll();
      if (token !== runToken) return;
      await sleep(60);
      lanes.forEach(prepareLane);
      setState("countdown");
      await countdown();
      if (token !== runToken) return;
      setState("racing");
      lanes.forEach(playLane);
      resetClock();
      startClock();
    } catch (error) {
      console.error(error);
      setState("error");
    } finally {
      if (token === runToken) busy = false;
    }
  }

  async function togglePause() {
    if (busy) return;
    if (state === "racing") {
      lanes.forEach(pauseLane);
      stopClock();
      setState("paused");
    } else if (state === "paused") {
      lanes.forEach(playLane);
      startClock();
      setState("racing");
    }
  }

  function stopAndReset() {
    runToken += 1;
    busy = false;
    lanes.forEach((lane) => {
      if (lane.iframe) lane.iframe.remove();
      lane.iframe = null;
    });
    resetClock();
    setState("ready");
  }

  function onSelectionChange(event) {
    const checked = inputs.filter((input) => input.checked);
    if (checked.length > MAX) {
      if (event && event.target) event.target.checked = false;
      renderPickerMessage(label("pickLess", `Choose at most ${MAX} runs.`));
      return;
    }
    if (checked.length < MIN) {
      if (event && event.target) event.target.checked = true;
      renderPickerMessage(label("pickMore", `Select at least ${MIN} runs.`));
      return;
    }
    selected = checked.map((input) => input.value);
    renderPickerMessage();
    updateUrl();
    stopAndReset();
    renderLanes();
  }

  inputs.forEach((input) => input.addEventListener("change", onSelectionChange));

  if (startBtn) startBtn.addEventListener("click", sequence);
  if (pauseBtn) pauseBtn.addEventListener("click", togglePause);
  if (resumeBtn) resumeBtn.addEventListener("click", togglePause);
  if (restartBtn) {
    restartBtn.addEventListener("click", () => {
      if (busy) return;
      sequence();
    });
  }

  renderPickerMessage();
  updateUrl();
  renderLanes();
  setState("ready");
})();
