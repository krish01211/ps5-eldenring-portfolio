/* =====================================================================
   VIEW — everything that draws to the screen. No app logic lives here.
   ===================================================================== */

const View = {

  reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,

  els: {
    screens:      {},   // filled in init()
    menuItems:    [],
    creativeMenuItems: [],
    wipe:         document.getElementById("wipe"),
    featGrid:     document.getElementById("feat-grid"),
    repoGrid:     document.getElementById("repo-grid"),
    repoStatus:   document.getElementById("repo-status"),
    skillsBody:   document.getElementById("skills-body"),
    certsMarquee: document.getElementById("certs-marquee-content"),
    experienceTimeline: document.getElementById("experience-timeline-content"),
    videoTrack:   document.getElementById("carousel-video-track"),
    videoCounter: document.getElementById("carousel-counter"),
    sfx:          document.getElementById("sfx-select"),
    cursor:       document.getElementById("cursor"),
    clock:        document.getElementById("clock"),
  },

  init() {
    // Collect all screens
    document.querySelectorAll(".screen").forEach(s => {
      this.els.screens[s.id.replace("screen-", "")] = s;
    });

    this.els.menuItems = [...document.querySelectorAll(".menu-item")];
    this.els.creativeMenuItems = [...document.querySelectorAll(".creative-menu-item")];

    // Ransomize text headers
    document.querySelectorAll("[data-ransom]").forEach(el => this.ransomize(el));

    this.els.sfx.volume = 0.45;
    this.startClock();
    this.startParallax();
    this.startCursor();

    document.body.classList.add("loaded");
  },

  // Deterministic pseudo-random hash so ransom typography stays consistent
  hash(str) {
    let h = 9;
    for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 387420489);
    return (h ^ h >>> 9) >>> 0;
  },

  /* ---------- Ransom-note lettering ---------- */
  ransomize(el) {
    const text = el.dataset.ransom || el.textContent;
    el.textContent = "";
    [...text].forEach((c, i) => {
      if (c === " ") {
        const space = document.createElement("span");
        space.style.display = "inline-block";
        space.style.width = "0.25em";
        el.appendChild(space);
        return;
      }
      const span = document.createElement("span");
      span.className = "ch display";
      span.textContent = c;
      const h = this.hash(text + i);
      const rot = (h % 17) - 8;                 // -8..8 degrees
      const scale = 0.86 + ((h >> 3) % 30) / 100; // 0.86..1.15
      const dy = ((h >> 5) % 9) - 4;            // -4..4 px
      const t = `rotate(${rot}deg) scale(${scale}) translateY(${dy}px)`;
      span.style.setProperty("--t", t);
      span.style.transform = t;
      
      const variant = (h >> 7) % 10;
      if (variant === 0) span.classList.add("box");
      else if (variant === 1) span.classList.add("boxw");
      else if (variant === 2) span.classList.add("red");
      
      el.appendChild(span);
    });
  },

  /* ---------- Screens & menus ---------- */
  showScreen(name, mode) {
    Object.values(this.els.screens).forEach(sc => sc.classList.remove("active"));
    
    // Fallbacks to resolve different screen tags in HTML vs state names
    let screenKey = name;
    if (mode === "creative" && name === "home") screenKey = "creative-home";
    if (mode === "creative" && name === "about") screenKey = "creative-about";
    if (mode === "creative" && name === "contact") screenKey = "creative-contact";
    
    const targetScreen = this.els.screens[screenKey];
    if (targetScreen) {
      targetScreen.classList.add("active");
      targetScreen.scrollTop = 0;
    }
    
    document.body.dataset.screen = name;
  },

  setMenuSelection(index, mode) {
    if (mode === "tech") {
      this.els.menuItems.forEach((m, j) => m.classList.toggle("sel", j === index));
    } else {
      this.els.creativeMenuItems.forEach((m, j) => m.classList.toggle("sel", j === index));
    }
  },

  // Wipe transition
  wipe(swap, done) {
    if (this.reducedMotion) { swap(); done(); return; }
    const w = this.els.wipe;
    w.classList.remove("go"); void w.offsetWidth; // force reflow
    w.classList.add("go");
    setTimeout(swap, 340);
    setTimeout(done, 720);
  },

  /* ---------- Sound ---------- */
  playSelect() {
    try {
      this.els.sfx.currentTime = 0;
      const p = this.els.sfx.play();
      if (p && p.catch) p.catch(() => {});
    } catch {}
  },

  /* ---------- Project Cards ---------- */
  cardThumb(src) {
    if (!src) return "";
    return `<div class="thumb"><img src="${src}" alt="" loading="lazy" onerror="this.closest('.thumb').remove()"></div>`;
  },

  splitTitle(title) {
    const first = title.split(" ")[0];
    return `<em>${first}</em>${title.slice(first.length)}`;
  },

  renderFeatured(list) {
    if (this.els.featGrid.childElementCount) return;
    list.forEach((f, i) => {
      const a = document.createElement("a");
      a.className = "card feat";
      a.href = f.url; a.target = "_blank"; a.rel = "noopener";
      a.style.setProperty("--tilt", ((this.hash(f.title) % 5) - 2) * 0.8 + "deg");
      a.style.setProperty("--d", i * 70 + "ms");
      a.innerHTML = `
        ${this.cardThumb(f.img)}
        <span class="lang" style="--lc:${f.color}">${f.tag}</span>
        <h3>${f.live ? '<span class="live-dot"></span>' : ""}${this.splitTitle(f.title)}</h3>
        <p>${f.desc}</p>
        <div class="meta"><span>${f.live ? "LIVE NOW" : "HIGHLIGHT"}</span><span class="go">${f.cta}</span></div>`;
      this.els.featGrid.appendChild(a);
    });
  },

  renderRepos(repos, statusText, model) {
    this.els.repoStatus.textContent = statusText;
    this.els.repoGrid.innerHTML = "";
    repos.forEach((r, i) => {
      const a = document.createElement("a");
      a.className = "card";
      a.href = r.html_url; a.target = "_blank"; a.rel = "noopener";
      a.style.setProperty("--tilt", ((this.hash(r.name) % 5) - 2) * 0.8 + "deg");
      a.style.setProperty("--d", i * 70 + "ms");
      a.style.setProperty("--lc", model.langColors[r.language] || "#e60012");
      const pretty = r.name.replace(/[-_]/g, " ").replace(/\b\w/g, c => c.toUpperCase());
      a.innerHTML = `
        <span class="lang">${r.language || "Repo"}</span>
        <h3>${this.splitTitle(pretty)}</h3>
        <p>${r.description || "No description yet, but the repository code is live."}</p>
        <div class="meta">
          <span>★ ${r.stargazers_count || 0}</span>
          <span class="go">View on GitHub →</span>
        </div>`;
      this.els.repoGrid.appendChild(a);
    });

    // Add + MORE card at the end of the grid linking to GitHub repos tab
    const moreCard = document.createElement("a");
    moreCard.className = "card feat";
    moreCard.href = `https://github.com/${model.githubUser}?tab=repositories`;
    moreCard.target = "_blank";
    moreCard.rel = "noopener";
    moreCard.style.setProperty("--tilt", "1.5deg");
    moreCard.style.setProperty("--d", `${repos.length * 70}ms`);
    moreCard.innerHTML = `
      <span class="lang" style="--lc:#e60012">GitHub</span>
      <h3>+ MORE</h3>
      <p>Explore all my other repositories, projects, and contributions directly on my GitHub profile page.</p>
      <div class="meta">
        <span>${repos.length + 4}+ Repos</span>
        <span class="go">GitHub Profile →</span>
      </div>`;
    this.els.repoGrid.appendChild(moreCard);
  },

  /* ---------- Skills & Certifications ---------- */
  renderSkills(groups) {
    if (this.els.skillsBody.childElementCount) return;
    groups.forEach(g => {
      const div = document.createElement("div");
      div.className = "skill-group";
      div.innerHTML = `<h3>${g.group}</h3>`;
      g.items.forEach(([name, value]) => {
        const row = document.createElement("div");
        row.className = "skill-row";
        row.innerHTML = `
          <span class="name">${name}</span>
          <div class="skill-bar"><div class="fill" data-v="${value}"></div></div>
          <span class="lv">${value}</span>`;
        div.appendChild(row);
      });
      this.els.skillsBody.appendChild(div);
    });
  },

  animateSkillBars() {
    const fills = this.els.skillsBody.querySelectorAll(".fill");
    fills.forEach(f => { f.style.width = "0"; });
    requestAnimationFrame(() => requestAnimationFrame(() => {
      fills.forEach((f, i) => setTimeout(() => { f.style.width = f.dataset.v + "%"; }, i * 60));
    }));
  },

  renderCertifications(certs) {
    if (this.els.certsMarquee.childElementCount) return;
    // Render twice for continuous looping marquee
    const list = [...certs, ...certs];
    list.forEach(c => {
      const badge = document.createElement("div");
      badge.className = "cert-badge-card";
      badge.innerHTML = `<span>${c}</span>`;
      this.els.certsMarquee.appendChild(badge);
    });
  },

  /* ---------- Experience Timeline ---------- */
  renderExperience(expList) {
    if (this.els.experienceTimeline.childElementCount) return;
    expList.forEach((exp, i) => {
      const item = document.createElement("div");
      item.className = "timeline-entry";
      item.style.animationDelay = `${i * 150}ms`;
      item.innerHTML = `
        <div class="timeline-dot"></div>
        <div class="timeline-card">
          <h3>${exp.role}</h3>
          <h4>${exp.company}</h4>
          <span class="time">${exp.time}</span>
          <p>${exp.desc}</p>
        </div>`;
      this.els.experienceTimeline.appendChild(item);
    });
  },

  /* ---------- Creative Mode Video Carousel ---------- */
  renderVideoCarousel(videos) {
    if (this.els.videoTrack.childElementCount) return;
    videos.forEach(v => {
      const slide = document.createElement("div");
      slide.className = "carousel-slide";
      slide.innerHTML = `
        <div class="video-wrapper">
          <iframe src="https://drive.google.com/file/d/${v.driveId}/preview" allow="autoplay" allowfullscreen></iframe>
        </div>
        <div class="video-info">
          <h3>${v.title}</h3>
          <p>${v.desc}</p>
        </div>`;
      this.els.videoTrack.appendChild(slide);
    });
  },

  setCarouselIndex(index, total) {
    this.els.videoTrack.style.transform = `translateX(-${index * 100}%)`;
    this.els.videoCounter.textContent = `${index + 1} / ${total}`;
  },

  /* ---------- Parallax & Clock ---------- */
  startClock() {
    const update = () => {
      const now = new Date();
      const options = { hour: "2-digit", minute: "2-digit" };
      this.els.clock.textContent = now.toLocaleTimeString([], options) + " · LOCAL";
    };
    update();
    setInterval(update, 1000);
  },

  startParallax() {
    if (this.reducedMotion) return;
    const stripes = document.getElementById("bg-stripes");
    const halftone = document.getElementById("bg-halftone");
    const arts = [...document.querySelectorAll(".menu-art")];
    const secBgs = [...document.querySelectorAll(".section-bg")];
    let tx = 0, ty = 0, cx = 0, cy = 0;
    
    addEventListener("mousemove", e => {
      tx = e.clientX / innerWidth - 0.5;
      ty = e.clientY / innerHeight - 0.5;
    }, { passive: true });

    const loop = () => {
      cx += (tx - cx) * 0.06; cy += (ty - cy) * 0.06;
      stripes.style.transform = `translate(${cx * 22}px, ${cy * 14}px)`;
      halftone.style.transform = `translate(${cx * -34}px, ${cy * -22}px)`;
      arts.forEach(a => {
        if (a.isConnected) {
          a.style.transform = `translate(${cx * 14}px, ${cy * 9}px) scale(1.04)`;
        }
      });
      secBgs.forEach(bg => {
        if (bg.isConnected) {
          bg.style.transform = `translate(${cx * 28}px, ${cy * 18}px)`;
        }
      });
      requestAnimationFrame(loop);
    };
    loop();
  },

  // 30-frame cursor strip setup
  startCursor() {
    if (!matchMedia("(pointer:fine)").matches || this.reducedMotion) return;
    const cur = this.els.cursor;
    document.body.classList.add("cursor-on");
    let x = -100, y = -100, frame = 0, last = 0, visible = false;

    addEventListener("mousemove", e => {
      x = e.clientX; y = e.clientY;
      if (!visible) { cur.style.display = "block"; visible = true; }
      
      const t = e.target;
      const overLink = t.closest &&
        t.closest("a, button, .card, .menu-item, .back-hint, .contact-chip, #big-name, #mode-toggle-btn, .creative-menu-item, .carousel-btn, .creative-chip");
      cur.classList.toggle("link", !!overLink);
    }, { passive: true });

    document.documentElement.addEventListener("mouseleave", () => {
      cur.style.display = "none"; visible = false;
    });

    const tick = ts => {
      if (ts - last >= 50) { // 50ms = original cursor frame tick
        frame = (frame + 1) % 30; last = ts;
        cur.style.backgroundPosition = -frame * 48 + "px 0";
      }
      cur.style.transform = `translate(${x}px, ${y}px)`;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
};
