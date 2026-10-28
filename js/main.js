(function () {
  "use strict";

  const data = window.PORTFOLIO;
  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

  root.classList.add("js");

  const escapeHtml = (value) =>
    String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  const projectById = (id) => data.projects.find((p) => p.id === id);

  // "+233548761498" -> "+233 54 876 1498": country code, then groups of 3 with a final 4.
  function formatPhone(raw) {
    const digits = raw.replace(/\D/g, "");
    if (!raw.startsWith("+233") || digits.length < 9) return raw;
    const local = digits.slice(3);
    const tail = local.slice(-4);
    const head = local.slice(0, -4);
    const groups = head.length > 3 ? [head.slice(0, head.length - 3), head.slice(-3)] : [head];
    return `+233 ${[...groups, tail].join(" ")}`;
  }

  /* ---------- Site details ---------- */

  function renderSiteDetails() {
    const { site } = data;
    const set = (key, value) => document.querySelectorAll(`[data-site='${key}']`).forEach((el) => (el.textContent = value));
    set("wordmark", site.wordmark);
    set("owner", site.ownerName);
    set("year", new Date().getFullYear());
    set("availability", site.availability || "");
    document.querySelectorAll("[data-availability]").forEach((el) => (el.hidden = !site.availability));

    const people = document.querySelector("[data-contact-people]");
    if (people) {
      people.innerHTML = site.people
        .map(
          (person) => `
          <li class="person">
            <h3 class="person__name">${escapeHtml(person.name)}</h3>
            <span class="person__line">
              <a class="contact__email" href="mailto:${escapeHtml(person.email)}">${escapeHtml(person.email)}</a>
              <button class="copy-btn" type="button" data-copy="${escapeHtml(person.email)}">Copy<span class="sr-only"> ${escapeHtml(person.email)}</span></button>
            </span>
            <a class="contact__phone" href="tel:${escapeHtml(person.phone.replace(/[^\d+]/g, ""))}">${escapeHtml(formatPhone(person.phone))}</a>
          </li>`
        )
        .join("");
    }
    document.querySelectorAll("[data-project-count]").forEach((el) => {
      el.textContent = String(data.projects.length).padStart(2, "0");
    });
  }

  /* ---------- Hero: a small rotating window onto the real projects ---------- */

  function setupHeroThumb() {
    const thumb = document.querySelector("[data-hero-thumb]");
    if (!thumb) return;
    thumb.innerHTML = data.projects
      .map((p, i) => `<img src="${escapeHtml(p.shots.desktop)}" alt="" class="${i === 0 ? "is-active" : ""}" decoding="async" />`)
      .join("");

    const imgs = [...thumb.querySelectorAll("img")];
    let index = 0;
    let timer = null;
    const start = () => {
      if (timer || reduceMotion.matches || imgs.length < 2) return;
      timer = setInterval(() => {
        imgs[index].classList.remove("is-active");
        index = (index + 1) % imgs.length;
        imgs[index].classList.add("is-active");
      }, 2600);
    };
    const stop = () => {
      clearInterval(timer);
      timer = null;
    };
    start();
    reduceMotion.addEventListener("change", () => (reduceMotion.matches ? stop() : start()));
    document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
  }

  /* ---------- Services ticker ---------- */

  function renderTicker() {
    const track = document.querySelector("[data-ticker]");
    if (!track) return;
    const items = data.services.map((s) => `<li>${escapeHtml(s)}</li>`).join("");
    // The second copy only exists to make the loop seamless.
    track.innerHTML = `<ul class="ticker__group">${items}</ul><ul class="ticker__group" aria-hidden="true">${items}</ul>`;
  }

  /* ---------- Project cards ---------- */

  const arrow = `<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false"><path d="M7 17 17 7M8 7h9v9" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="square" /></svg>`;

  function projectCard(p) {
    const host = new URL(p.url).host.replace(/^www\./, "");
    const style = `--panel:${p.panel.bg};--panel-ink:${p.panel.ink}`;
    const tags = p.tags.map((t) => `<li>${escapeHtml(t)}</li>`).join("");

    return `
      <article class="project project--${p.layout} reveal" id="project-${p.id}" style="${style}" aria-labelledby="project-${p.id}-title">
        <div class="project__stage" aria-hidden="true">
          <span class="project__domain"><span class="status-dot"></span>${escapeHtml(host)}</span>
          <div class="frame frame--desktop">
            <div class="frame__bar"><i></i><i></i><i></i><span>${escapeHtml(p.url)}</span></div>
            <div class="frame__screen" data-scroll-screen>
              <img src="${escapeHtml(p.shots.desktop)}" alt="" width="1440" height="3600" loading="lazy" decoding="async" />
            </div>
          </div>
          <div class="frame frame--mobile">
            <img src="${escapeHtml(p.shots.mobile)}" alt="" width="780" height="1688" loading="lazy" decoding="async" />
          </div>
          <span class="project__cursor">Visit site ${arrow}</span>
        </div>

        <div class="project__body">
          <div class="project__head">
            <p class="project__cat"><span class="project__num">${escapeHtml(p.number)}</span>${escapeHtml(p.category)} <span>/</span> ${escapeHtml(p.sector)}</p>
            <h3 class="project__title" id="project-${p.id}-title">${escapeHtml(p.name)}</h3>
          </div>
          <p class="project__desc">${escapeHtml(p.description)}</p>
          <ul class="project__tags" aria-label="Project tags">${tags}</ul>
          <div class="project__foot">
            <p class="project__url"><span>Live at</span> ${escapeHtml(p.url)}</p>
            <a class="project__link" href="${escapeHtml(p.url)}" target="_blank" rel="noopener noreferrer">
              Explore live site<span class="sr-only">: ${escapeHtml(p.name)} (opens in a new tab)</span>
              <span class="project__arrow">${arrow}</span>
            </a>
          </div>
        </div>
      </article>`;
  }

  function renderProjects() {
    const grid = document.querySelector("[data-projects]");
    if (!grid) return;
    grid.innerHTML = data.projects.map(projectCard).join("");
  }

  // How far each desktop screenshot can scroll inside its frame on hover.
  function measureScreens() {
    document.querySelectorAll("[data-scroll-screen]").forEach((screen) => {
      const img = screen.querySelector("img");
      const update = () => {
        const distance = Math.max(0, img.getBoundingClientRect().height - screen.clientHeight);
        screen.style.setProperty("--scroll", `${-distance}px`);
        screen.style.setProperty("--scroll-time", `${Math.min(9, Math.max(3, distance / 220))}s`);
      };
      img.complete ? update() : img.addEventListener("load", update, { once: true });
      if ("ResizeObserver" in window) new ResizeObserver(update).observe(screen);
    });
  }

  // A "Visit site" label that follows the pointer over the project stage.
  function setupCursor() {
    document.querySelectorAll(".project").forEach((card) => {
      const stage = card.querySelector(".project__stage");
      const cursor = card.querySelector(".project__cursor");
      stage.addEventListener("pointermove", (e) => {
        if (!finePointer.matches) return;
        const r = stage.getBoundingClientRect();
        cursor.style.transform = `translate(${e.clientX - r.left}px, ${e.clientY - r.top}px)`;
        card.classList.add("has-cursor");
      });
      stage.addEventListener("pointerleave", () => card.classList.remove("has-cursor"));
    });
  }

  /* ---------- Capabilities ---------- */

  function renderCapabilities() {
    const list = document.querySelector("[data-capabilities]");
    if (!list) return;
    list.innerHTML = data.capabilities
      .map((c, i) => {
        const p = c.project && projectById(c.project);
        const see = p
          ? `<a class="capability__see" href="#project-${p.id}">See ${escapeHtml(p.name)} <span aria-hidden="true">↑</span></a>`
          : `<a class="capability__see" href="#contact">Start a conversation <span aria-hidden="true">→</span></a>`;
        return `
          <li class="capability reveal">
            <span class="capability__num">${String(i + 1).padStart(2, "0")}</span>
            <h3 class="capability__title">${escapeHtml(c.title)}</h3>
            <p class="capability__text">${escapeHtml(c.text)}</p>
            ${see}
          </li>`;
      })
      .join("");
  }

  /* ---------- Contact: brief builder & copy email ---------- */

  function setupContact() {
    const form = document.querySelector("[data-brief]");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const f = new FormData(form);
        const name = (f.get("name") || "").trim();
        const org = (f.get("org") || "").trim();
        const type = f.get("type");
        const message = (f.get("message") || "").trim();
        const subject = `Project enquiry: ${type}${org ? ` for ${org}` : ""}`;
        const body = [
          "Hi,",
          "",
          `I'm interested in ${type.toLowerCase()}.`,
          "",
          message || "[A few words about the project]",
          "",
          name ? `Thanks,\n${name}${org ? `\n${org}` : ""}` : "Thanks",
        ].join("\n");
        window.location.href = `mailto:${data.site.people.map((p) => p.email).join(",")}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      });
    }

    const status = document.querySelector("[data-copy-status]");
    document.querySelectorAll("[data-copy]").forEach((copy) => {
      if (!navigator.clipboard) {
        copy.hidden = true;
        return;
      }
      const label = copy.innerHTML;
      copy.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(copy.dataset.copy);
          copy.textContent = "Copied";
          status.textContent = `${copy.dataset.copy} copied to clipboard`;
        } catch {
          copy.textContent = "Copy failed";
          status.textContent = "Could not copy the email address";
        }
        setTimeout(() => {
          copy.innerHTML = label;
          status.textContent = "";
        }, 2000);
      });
    });
  }

  /* ---------- Navigation ---------- */

  function setupNav() {
    const header = document.querySelector(".site-header");
    const toggle = document.querySelector(".nav-toggle");
    const menu = document.getElementById("site-menu");
    if (!header || !toggle || !menu) return;

    const setOpen = (open, { returnFocus = false } = {}) => {
      toggle.setAttribute("aria-expanded", String(open));
      toggle.querySelector(".nav-toggle__label").textContent = open ? "Close" : "Menu";
      header.classList.toggle("is-open", open);
      document.body.classList.toggle("menu-open", open);
      if (!open && returnFocus) toggle.focus();
    };

    toggle.addEventListener("click", () => setOpen(toggle.getAttribute("aria-expanded") !== "true"));
    menu.addEventListener("click", (e) => {
      if (e.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") setOpen(false, { returnFocus: true });
    });
    window.matchMedia("(min-width: 860px)").addEventListener("change", (e) => {
      if (e.matches) setOpen(false);
    });

    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- In-page links: move focus to the target for keyboard users ---------- */

  function setupAnchors() {
    document.addEventListener("click", (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute("href").slice(1);
      const target = id ? document.getElementById(id) : null;
      if (!target) return;
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      requestAnimationFrame(() => target.focus({ preventScroll: true }));
    });
  }

  /* ---------- Hero project pills ---------- */

  function renderPeek() {
    const list = document.querySelector("[data-peek]");
    if (!list) return;
    list.innerHTML = data.projects
      .map(
        (p) => `
        <li>
          <a class="peek__item" href="#project-${p.id}" style="--panel:${p.panel.bg};--panel-ink:${p.panel.ink}">
            <span class="peek__thumb"><img src="${escapeHtml(p.shots.desktop)}" alt="" loading="lazy" decoding="async" /></span>
            <span class="peek__name">${escapeHtml(p.name)}</span>
            <span class="peek__sector">${escapeHtml(p.sector)}</span>
          </a>
        </li>`
      )
      .join("");
  }

  /* ---------- Scroll reveal ---------- */

  function setupReveal() {
    const items = document.querySelectorAll(".reveal");
    if (reduceMotion.matches || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.06 }
    );
    items.forEach((el) => io.observe(el));
  }

  renderSiteDetails();
  setupHeroThumb();
  renderTicker();
  renderProjects();
  renderPeek();
  renderCapabilities();
  measureScreens();
  setupCursor();
  setupContact();
  setupNav();
  setupAnchors();
  setupReveal();
})();
