# PS5-Eldenring-portfolio

I do two things — write code and edit video. Most portfolios make you pick one. This one doesn't.

Built around a mode switcher that wipes the entire screen and drops you into a completely different visual world. Tech side pulls from Persona 5. Creative side pulls from Elden Ring. Both are fully fleshed out, not just a color swap.

→ **[Live site](https://krish-folio.vercel.app/)**

---

## The idea

The switcher isn't a gimmick. The two sides genuinely have different purposes:

- **Tech** — shows development work, live GitHub repos, skills, certs. Persona 5 aesthetic: red/black, angular cards, ransom-note type, screen wipe transitions.
- **Creative** — shows video editing work, client outcomes, software stack. Elden Ring aesthetic: cinematic gold, slow reveals, editorial typography, custom video carousel.

Keyboard navigation works across the whole thing. Arrow keys to move, Enter to open, Esc to go back. Sound effects on selections (after first user interaction, so it doesn't autoplay on load).

---

## Stack

Vanilla HTML, CSS, and JS. MVC pattern — model handles state and GitHub API calls, view handles rendering, controller handles input and audio. No build step, no dependencies.

Contact form goes through Formspree. If that fails or the user is offline, it falls back to a pre-populated mailto link automatically.

---

## Run it locally

```bash
git clone https://github.com/krish01211/ps5-eldenring-portfolio.git
cd ps5-eldenring-portfolio
python -m http.server 8000
```

Needs a local server — loading fonts and audio files directly from the filesystem hits CORS issues. `npx http-server` or VS Code's Live Server extension both work fine too.

---

## Structure

```
css/
  style.css           both themes, keyframes, custom scrollbars
js/
  model.js            state, data, GitHub API wrapper
  view.js             DOM rendering, screen wipes, slider
  controller.js       keyboard bindings, audio, event wiring
public/
  fonts/
  images/
  sounds/
  textures/
index.html
vercel.json
```

---

## Deploy

Vercel, zero config. Connect repo, hit deploy. The `vercel.json` handles routing for direct URL access.

---

krishna.v.kireeti@gmail.com · [LinkedIn](https://www.linkedin.com/in/krishna-kireeti-v/) · [GitHub](https://github.com/krish01211)
