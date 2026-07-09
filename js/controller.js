/* =====================================================================
   CONTROLLER — listens to user interactions, updates state, drives view.
   ===================================================================== */

const Controller = {

  transitioning: false,
  audioUnlocked: false,

  init() {
    View.init();
    
    // Bind layouts and inputs
    this.bindMenu();
    this.bindKeyboard();
    this.bindAudioUnlock();
    this.bindContactForm();
    this.bindModeToggle();
    this.bindCarouselControls();
    
    // Initial triggers
    this.select(0);
  },

  /* ---------- Mode Toggle System ---------- */
  bindModeToggle() {
    const btn = document.getElementById("mode-toggle-btn");
    if (btn) {
      btn.addEventListener("click", () => this.toggleMode());
    }
  },

  toggleMode() {
    if (this.transitioning) return;
    this.transitioning = true;
    this.play();

    const newMode = Model.state.mode === "tech" ? "creative" : "tech";
    const targetScreen = "home"; // reset to home during screen wipe

    View.wipe(
      () => {
        // Swap model mode
        Model.state.mode = newMode;
        Model.state.screen = targetScreen;
        
        // Apply dataset mode to body
        document.body.dataset.mode = newMode;

        // Sync header tags
        const subtitle = document.getElementById("hud-subtitle");
        if (newMode === "tech") {
          subtitle.textContent = "CSE @ SRM AP · Full Stack · ML";
        } else {
          subtitle.textContent = "VIDEO EDITOR · POST PRODUCTION · STORYTELLER";
        }

        // Show screen
        View.showScreen(targetScreen, newMode);
        
        // Reset selections
        Model.state.menuIndex = 0;
        Model.state.creativeMenuIndex = 0;
        this.select(0);
      },
      () => {
        this.transitioning = false;
      }
    );
  },

  /* ---------- Navigation Screen Swaps ---------- */
  goTo(screen) {
    if (this.transitioning || screen === Model.state.screen) return;
    this.transitioning = true;
    this.play();

    View.wipe(
      () => {
        Model.state.screen = screen;
        View.showScreen(screen, Model.state.mode);
        
        // Lazy load content if needed
        if (screen === "projects") this.loadProjects();
        if (screen === "skills") this.loadSkills();
        if (screen === "experience") this.loadExperience();
        if (screen === "showreel") this.loadShowreel();
      },
      () => {
        this.transitioning = false;
      }
    );
  },

  select(index) {
    const mode = Model.state.mode;
    if (mode === "tech") {
      const items = View.els.menuItems;
      const n = items.length;
      const next = (index + n) % n;
      if (next !== Model.state.menuIndex) this.play();
      Model.state.menuIndex = next;
      View.setMenuSelection(next, "tech");
    } else {
      const items = View.els.creativeMenuItems;
      const n = items.length;
      const next = (index + n) % n;
      if (next !== Model.state.creativeMenuIndex) this.play();
      Model.state.creativeMenuIndex = next;
      View.setMenuSelection(next, "creative");
    }
  },

  /* ---------- Video Carousel Controls ---------- */
  bindCarouselControls() {
    const prev = document.getElementById("carousel-prev");
    const next = document.getElementById("carousel-next");
    if (prev && next) {
      prev.addEventListener("click", () => this.navigateCarousel(-1));
      next.addEventListener("click", () => this.navigateCarousel(1));
    }
  },

  navigateCarousel(direction) {
    if (this.transitioning) return;
    this.play();
    const total = Model.videos.length;
    let nextIndex = Model.state.activeVideoIndex + direction;
    if (nextIndex < 0) nextIndex = total - 1;
    if (nextIndex >= total) nextIndex = 0;
    
    Model.state.activeVideoIndex = nextIndex;
    View.setCarouselIndex(nextIndex, total);
  },

  /* ---------- Lazy Loading data ---------- */
  async loadProjects() {
    View.renderFeatured(Model.featured);
    if (Model.state.reposLoaded) return;
    const { repos, live } = await Model.fetchRepos();
    const statusText = live
      ? `${repos.length} repositories · live from GitHub`
      : "Showing pinned work · GitHub API unavailable right now";
    View.renderRepos(repos, statusText, Model);
    Model.state.reposLoaded = true;
  },

  loadSkills() {
    View.renderSkills(Model.skills);
    View.renderCertifications(Model.certifications);
    View.animateSkillBars();
    Model.state.skillsBuilt = true;
  },

  loadExperience() {
    View.renderExperience(Model.experience);
    Model.state.experienceBuilt = true;
  },

  loadShowreel() {
    View.renderVideoCarousel(Model.videos);
    View.setCarouselIndex(Model.state.activeVideoIndex, Model.videos.length);
  },

  /* ---------- Contact Form Handler ---------- */
  bindContactForm() {
    const forms = document.querySelectorAll(".contact-form-el");
    forms.forEach(form => {
      const status = form.querySelector(".form-status-msg");
      const btn = form.querySelector(".form-send-btn");
      if (!btn) return;

      form.addEventListener("submit", async e => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(form).entries());
        if (data._honey) return; // bot detection
        if (!data.name.trim() || !data.email.trim() || !data.message.trim()) {
          status.textContent = "Fill in all fields first.";
          return;
        }
        btn.disabled = true;
        status.textContent = "Sending…";
        try {
          const res = await fetch("https://formspree.io/f/xojooypa", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            body: JSON.stringify({
              name: data.name,
              email: data.email,
              message: data.message,
            }),
          });
          if (!res.ok) throw new Error(res.status);
          status.textContent = "Sent! I'll get back to you soon.";
          form.reset();
          this.play();
        } catch {
          status.textContent = "Failed. Opening mail client instead...";
          const subject = encodeURIComponent(`Portfolio message from ${data.name}`);
          const body = encodeURIComponent(`${data.message}\n\nReply to: ${data.email}`);
          location.href = `mailto:${Model.contactEmail}?subject=${subject}&body=${body}`;
        } finally {
          btn.disabled = false;
        }
      });
    });
  },

  /* ---------- Sound triggers ---------- */
  play() {
    if (this.audioUnlocked) View.playSelect();
  },

  bindAudioUnlock() {
    const unlock = () => { this.audioUnlocked = true; };
    addEventListener("pointerdown", unlock, { once: true, capture: true });
    addEventListener("keydown", unlock, { once: true, capture: true });
  },

  /* ---------- Inputs (Keyboard & Mouse) ---------- */
  bindMenu() {
    // Tech Menu Items
    View.els.menuItems.forEach((item, i) => {
      item.addEventListener("mouseenter", () => {
        if (Model.state.mode === "tech") this.select(i);
      });
      item.addEventListener("click", () => {
        if (Model.state.mode === "tech") this.goTo(item.dataset.target);
      });
    });

    // Creative Menu Items
    View.els.creativeMenuItems.forEach((item, i) => {
      item.addEventListener("mouseenter", () => {
        if (Model.state.mode === "creative") this.select(i);
      });
      item.addEventListener("click", () => {
        if (Model.state.mode === "creative") this.goTo(item.dataset.target);
      });
    });

    // Click handlers for back buttons
    document.querySelectorAll("[data-back]").forEach(b =>
      b.addEventListener("click", () => this.goTo("home")));

    // Click handler for title tags -> returns home
    document.getElementById("big-name").addEventListener("click", () => {
      if (Model.state.screen !== "home") this.goTo("home");
      else this.play();
    });
  },

  bindKeyboard() {
    addEventListener("keydown", e => {
      const mode = Model.state.mode;
      const screen = Model.state.screen;

      if (screen === "home") {
        if (e.key === "ArrowDown") {
          const currentIndex = mode === "tech" ? Model.state.menuIndex : Model.state.creativeMenuIndex;
          this.select(currentIndex + 1);
          e.preventDefault();
        }
        else if (e.key === "ArrowUp") {
          const currentIndex = mode === "tech" ? Model.state.menuIndex : Model.state.creativeMenuIndex;
          this.select(currentIndex - 1);
          e.preventDefault();
        }
        else if (e.key === "Enter") {
          if (mode === "tech") {
            const target = View.els.menuItems[Model.state.menuIndex].dataset.target;
            this.goTo(target);
          } else {
            const target = View.els.creativeMenuItems[Model.state.creativeMenuIndex].dataset.target;
            this.goTo(target);
          }
        }
      } else {
        if (e.key === "Escape") {
          this.goTo("home");
        }
      }
    });
  }
};

Controller.init();
