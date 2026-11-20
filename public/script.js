// Pin wall behaviour: filter buttons + project pop-up.
(function () {
  const pins = Array.from(document.querySelectorAll(".pin"));
  const chips = Array.from(document.querySelectorAll(".chip"));

  // ---- Filters: show a count on each button, dim cards that don't match ----
  chips.forEach((chip) => {
    const f = chip.dataset.filter;
    const n = f === "all" ? pins.length : pins.filter((p) => p.dataset.tags.split(" ").includes(f)).length;
    const count = document.createElement("span");
    count.className = "count";
    count.textContent = n;
    chip.append(count);
    chip.setAttribute("aria-pressed", chip.classList.contains("is-on"));

    chip.addEventListener("click", () => {
      chips.forEach((c) => { c.classList.remove("is-on"); c.setAttribute("aria-pressed", "false"); });
      chip.classList.add("is-on");
      chip.setAttribute("aria-pressed", "true");
      pins.forEach((p) => {
        const match = f === "all" || p.dataset.tags.split(" ").includes(f);
        p.classList.toggle("is-dim", !match);
      });
    });
  });

  // ---- Pop-up panel ----
  const panel = document.getElementById("panel");
  const body = panel.querySelector(".panel-body");
  const colours = ["c-deep", "c-yellow", "c-cream", "c-mist"];
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
  // click outside the panel closes it
  panel.addEventListener("click", (e) => {
    const r = panel.getBoundingClientRect();
    const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    if (!inside) close();
  });
  panel.addEventListener("close", () => { if (lastCard) lastCard.focus(); });
})();
