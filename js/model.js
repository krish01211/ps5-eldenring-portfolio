/* =====================================================================
   MODEL — the data and state of the app. Never touches the DOM.
   ===================================================================== */

const Model = {

  githubUser: "krish01211",

  // Form submit relay email
  contactEmail: "krishna.v.kireeti@gmail.com",

  // App state
  state: {
    mode: "tech",          // "tech" or "creative"
    screen: "home",        // active screen (e.g. "home", "projects", "skills", "experience", "about", "contact")
    menuIndex: 0,          // selected index on tech home menu (0 to 4)
    creativeMenuIndex: 0,  // selected index on creative home menu (0 to 3)
    reposLoaded: false,
    skillsBuilt: false,
    experienceBuilt: false,
    activeVideoIndex: 0,   // active slide in showreel video carousel
  },

  // ---- Featured projects (Tech mode, shown above the GitHub feed) ----
  featured: [
    {
      title: "BondBox",
      tag: "★ 1st Place", color: "#e60012", live: false,
      url: "https://github.com/krish01211/BondBox", cta: "View on GitHub →",
      img: "public/images/characters/joker-mask.png.png", // will show mask or fallback to none
      desc: "An award-winning hackathon project. Designed as a secure, decentralized digital vault for family assets. Integrates multi-signature verification, encryption, and automated legacy transfers.",
    },
    {
      title: "LexyAI",
      tag: "Deep Learning", color: "#3178c6", live: false,
      url: "https://github.com/krish01211", cta: "View on GitHub →",
      img: "",
      desc: "An AI-powered conversational agent that leverages fine-tuned transformers to execute high-fidelity text extraction, summarization, and context-aware responses from complex document corpora.",
    },
    {
      title: "SmartDiary",
      tag: "Full Stack", color: "#f1e05a", live: false,
      url: "https://github.com/krish01211", cta: "View on GitHub →",
      img: "",
      desc: "An intelligent, encryption-backed digital diary incorporating sentiment analysis. Tracks user mood over time using NLP techniques and offers privacy-first local storage solutions.",
    },
    {
      title: "Rainfall Prediction Model",
      tag: "Machine Learning", color: "#3572A5", live: false,
      url: "https://github.com/krish01211", cta: "View on GitHub →",
      img: "",
      desc: "An ML pipeline comparing multiple regression models (Random Forest, XGBoost, and Support Vector Machines) to predict regional precipitation patterns using multi-decade meteorological records.",
    },
  ],

  // Repos already shown in "featured" get hidden from the GitHub feed
  featuredRepoNames: [
    "BondBox",
    "LexyAI",
    "SmartDiary",
  ],

  // Shown if the GitHub API can't be reached
  fallbackRepos: [
    {
      name: "Rainfall-Prediction-Model", language: "Python", stargazers_count: 1,
      html_url: "https://github.com/krish01211",
      description: "An ML predictive pipeline mapping historical weather variables to regional rainfall using class-weighted regression algorithms.",
    },
    {
      name: "Twitter-Sentiment-Classifier", language: "Python", stargazers_count: 2,
      html_url: "https://github.com/krish01211",
      description: "A machine learning classifier that labels sentiment distributions in real-time tweet streams using advanced preprocessing and SVMs.",
    },
    {
      name: "Email-Regen-Engine", language: "JavaScript", stargazers_count: 0,
      html_url: "https://github.com/krish01211",
      description: "An automated assistant that processes inbound emails and drafts professional, context-customized replies using LLM APIs.",
    },
  ],

  // GitHub Language Colors mapping
  langColors: {
    JavaScript: "#f1e05a", TypeScript: "#3178c6", Python: "#3572A5",
    HTML: "#e34c26", CSS: "#663399", Java: "#b07219", "C++": "#f34b7d", C: "#555",
    SQL: "#e38c00", JupyterNotebook: "#DA5B0B"
  },

  // ---- Skills screen data ----
  skills: [
    { group: "Programming Languages", items: [
      ["C / C++", 90], ["Python", 88], ["Java", 82], ["JavaScript / SQL", 85]
    ]},
    { group: "Web & Full-Stack Tools", items: [
      ["React · Next.js", 84], ["Node.js · Express", 80], ["FastAPI · REST APIs", 85], ["PostgreSQL · MySQL", 78]
    ]},
    { group: "Machine Learning & AI", items: [
      ["TensorFlow · Keras", 76], ["scikit-learn · Pandas", 84], ["OpenCV · NLP", 70]
    ]},
    { group: "Cloud & Dev Tech", items: [
      ["AWS Cloud Practitioner", 90], ["AWS Solutions Architect", 80], ["Git & GitHub Control", 86], ["Blender / Creative Suite", 72]
    ]}
  ],

  // ---- Certifications ticker ----
  certifications: [
    "AWS Certified Cloud Practitioner",
    "AWS Certified Solutions Architect",
    "Oracle Java SE 17 Certified",
    "Algo University Dynamic Programming",
    "Algo University Graph Algorithms",
    "IBM Frontend Developer Cert",
    "SAP Generative AI Foundation"
  ],

  // ---- Experience Timeline data ----
  experience: [
    {
      role: "AI / ML Intern",
      company: "Edunet Foundation",
      time: "June 2024 — July 2024",
      desc: "Assisted in research and development of machine learning workflows. Optimized data preprocessing, evaluated prediction performance models, and implemented regression pipelines."
    },
    {
      role: "Freelance Video Editor",
      company: "Self-Employed",
      time: "2021 — Present",
      desc: "Delivered post-production deliverables to 15+ international clients. Spliced visual assets, adjusted narratives, mixed audio tracks, and scaled digital audience outreach."
    },
    {
      role: "Post-Production Lead",
      company: "Cinemates Club",
      time: "2023 — Present",
      desc: "Coordinated creative direction and splicing workflows for collegiate media projects. Managed team editors, organized visual assets, and delivered polished promo trailers."
    },
    {
      role: "Social Media Marketing",
      company: "Bistea",
      time: "2023 — 2024",
      desc: "Curated vertical visual marketing formats, audited audience metrics, and managed online branding content pipelines."
    }
  ],

  // ---- Creative mode video embeds (YouTube) ----
  videos: [
    {
      title: "King Chris Edit",
      desc: "A stylized dynamic visual edit focusing on pacing, kinetic match cuts, and color matching.",
      youtubeId: "FBQtTewW8Nw", isShort: false
    },
    {
      title: "Gaming Style Edit",
      desc: "High-energy gaming-style edit with fast cuts, motion blur, and dynamic frame transitions.",
      youtubeId: "iAvagDTxUxc", isShort: false
    },
    {
      title: "Infinitus Tech Event Edit",
      desc: "Event coverage edit combining sound design, visual effects, and speed ramping for Infinitus.",
      youtubeId: "HK8StQxc7QU", isShort: false
    },
    {
      title: "AMV Style Edit",
      desc: "Anime Music Video style editing with visual flow, motion interpolation, and action sync.",
      youtubeId: "5hNUB9iRHC0", isShort: false
    },
    {
      title: "Judge Announcement Video",
      desc: "The critical visual highlight video that directly initiated contacts from film directors.",
      youtubeId: "S0hWfloYny4", isShort: false
    },
    {
      title: "Infinitus Edit 1",
      desc: "A rhythmic splice combining heavy sound design, visual effects, and speed ramping.",
      youtubeId: "jJ0yIHtrQgs", isShort: false
    },
    {
      title: "Announcement Motion Graphics",
      desc: "Motion graphics announcement combining typography, tracking, and After Effects keyframes.",
      youtubeId: "_lCk90wiGUw", isShort: true
    },
    {
      title: "Fast Pace Movie BTS Edit",
      desc: "Behind-the-scenes promotional format utilizing speed cuts, sound effects, and interviews.",
      youtubeId: "szOk__v-f7c", isShort: true
    },
    {
      title: "Spider-Man AE Edit",
      desc: "Cinematic montage with custom color grading, atmospheric sound, and After Effects compositing.",
      youtubeId: "7lsviKWYkak", isShort: true
    },
    {
      title: "Pepsi AE Loop Edit",
      desc: "An experimental seamless loop crafted with After Effects compositing and brand motion design.",
      youtubeId: "zQSONfpMtyA", isShort: true
    },
  ],

  // ---- Fetch Repos from GitHub ----
  async fetchRepos() {
    const skip = new Set(this.featuredRepoNames);
    try {
      const res = await fetch(
        `https://api.github.com/users/${this.githubUser}/repos?per_page=100&sort=updated`
      );
      if (!res.ok) throw new Error(res.status);
      const repos = (await res.json()).filter(r => 
        !r.fork && 
        r.description && 
        r.description.trim() !== "" &&
        !skip.has(r.name) &&
        !r.name.toLowerCase().includes("codsoft") &&
        !r.name.toLowerCase().includes("simple")
      );
      return { repos, live: true };
    } catch {
      return { 
        repos: this.fallbackRepos.filter(r => 
          !skip.has(r.name) && 
          r.description && 
          r.description.trim() !== "" &&
          !r.name.toLowerCase().includes("codsoft") &&
          !r.name.toLowerCase().includes("simple")
        ), 
        live: false 
      };
    }
  }
};
