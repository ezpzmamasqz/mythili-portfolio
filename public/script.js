// Pin wall behaviour: thread filters + project pop-up.
(function () {
  const wall = document.querySelector(".wall");
  const pins = Array.from(document.querySelectorAll(".pin"));
  const chips = Array.from(document.querySelectorAll(".chip"));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hasTag = (pin, tag) => pin.dataset.tags.split(" ").includes(tag);
  let current = "all";

  // ---- Threads: an SVG layer over the wall ----
  const NS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("class", "threads");
  svg.setAttribute("aria-hidden", "true");
  wall.append(svg);

  // Where each pin sits, relative to the wall.
  function pinPoint(pin) {
    const w = wall.getBoundingClientRect();
    const c = pin.querySelector(".card").getBoundingClientRect();
    return [c.left + c.width / 2 - w.left, c.top + 2 - w.top];
  }

  // A string that sags between two pins.
  function stringPath(points) {
    let d = `M ${points[0][0]} ${points[0][1]}`;
    for (let i = 1; i < points.length; i++) {
      const [x1, y1] = points[i - 1];
      const [x2, y2] = points[i];
      const dist = Math.hypot(x2 - x1, y2 - y1);
      const sag = Math.min(90, 18 + dist * 0.16);
      const cx = (x1 + x2) / 2;
      const cy = Math.max(y1, y2) + sag;
      d += ` Q ${cx} ${cy} ${x2} ${y2}`;
    }
    return d;
  }

  function drawThread(animate) {
    svg.innerHTML = "";
    if (current === "all") return;
    const tied = pins.filter((p) => hasTag(p, current));
    if (tied.length < 2) return;
    // Route the string row by row, zig-zagging (left→right, then right→left)
    // so it doesn't cut diagonally across the whole wall.
    const pts = tied.map(pinPoint).sort((a, b) => a[1] - b[1]);
    const rows = [];
    pts.forEach((p) => {
      const row = rows[rows.length - 1];
      if (row && Math.abs(p[1] - row[0][1]) < 90) row.push(p); else rows.push([p]);
    });
    const ordered = rows.flatMap((row, i) => row.sort((a, b) => (i % 2 ? b[0] - a[0] : a[0] - b[0])));
    const path = document.createElementNS(NS, "path");
    path.setAttribute("d", stringPath(ordered));
    svg.append(path);
    if (animate && !reduceMotion) {
      const len = path.getTotalLength();
      path.style.strokeDasharray = len;
      path.style.strokeDashoffset = len;
      path.getBoundingClientRect(); // start the animation from the hidden state
      path.style.transition = `stroke-dashoffset ${Math.min(2.2, 0.5 + len / 2500)}s cubic-bezier(.45,.05,.3,1)`;
      path.style.strokeDashoffset = "0";
      path.addEventListener("transitionend", () => { path.style.strokeDasharray = "none"; }, { once: true });
    }
  }

  function applyFilter(tag) {
    current = tag;
    chips.forEach((c) => {
      const on = c.dataset.filter === tag;
      c.classList.toggle("is-on", on);
      c.setAttribute("aria-pressed", on);
    });
    pins.forEach((p) => {
      const match = tag === "all" || hasTag(p, tag);
      p.classList.toggle("is-dim", !match);
      p.classList.toggle("is-tied", tag !== "all" && match);
    });
    drawThread(true);
  }

  chips.forEach((chip) => {
    const f = chip.dataset.filter;
    const count = document.createElement("span");
    count.className = "count";
    count.textContent = f === "all" ? pins.length : pins.filter((p) => hasTag(p, f)).length;
    chip.append(count);
    chip.setAttribute("aria-pressed", chip.classList.contains("is-on"));
    // Clicking the active thread again unties it.
    chip.addEventListener("click", () => applyFilter(current === f && f !== "all" ? "all" : f));
  });

  // Redraw when the layout changes size (e.g. phone rotated, fonts loaded).
  let t;
  const redraw = () => { clearTimeout(t); t = setTimeout(() => drawThread(false), 120); };
  window.addEventListener("resize", redraw);
  if (document.fonts) document.fonts.ready.then(redraw);

  // ---- Pop-up panel ----
  const panel = document.getElementById("panel");
  const body = panel.querySelector(".panel-body");
  const colours = ["c-deep", "c-navy", "c-blue", "c-aqua"];
  let lastCard = null;

  pins.forEach((pin) => {
    const card = pin.querySelector(".card");
    const detail = pin.querySelector(".detail");
    card.setAttribute("aria-haspopup", "dialog");
    card.addEventListener("click", () => {
      lastCard = card;
      body.innerHTML = detail.innerHTML;
      panel.classList.remove(...colours);
      panel.classList.add(colours.find((c) => pin.classList.contains(c)) || "c-deep");
      panel.setAttribute("aria-label", pin.querySelector(".card-title").textContent);
      panel.showModal();
      body.scrollTop = 0;
    });
  });

  const close = () => panel.close();
  panel.querySelector(".panel-close").addEventListener("click", close);
  panel.addEventListener("click", (e) => {
    const r = panel.getBoundingClientRect();
    const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    if (!inside) close();
  });
  panel.addEventListener("close", () => { if (lastCard) lastCard.focus(); });
})();
