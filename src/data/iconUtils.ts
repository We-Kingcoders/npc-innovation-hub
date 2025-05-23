// src/data/iconUtils.ts

export const getSkillIcon = (skillName: string): string => {
  const icons: { [key: string]: string } = {
    "Frontend Development": "💻",
    "Backend Development": "⚙️",
    "Database Management": "🗄️",
    "Version Control & Collaboration": "🔄",
    "DevOps & Deployment": "🚀",
    "Design Tools": "🎨",
    "User Experience": "👤",
    "Design Systems": "📐",
    "Mobile Development": "📱",
    "Backend Services": "🔧",
    "Cloud Platforms": "☁️",
    "System Administration": "🖥️",
    "Monitoring & Security": "🔒",
    "API Development": "🔌",
    "Frontend Tools": "🛠️",
    "Styling & Frameworks": "🎨",
    "Frontend Collaboration": "🤝",
  };
  return icons[skillName] || "⚡";
};

export const getTechnologyIcon = (techName: string): string => {
  const techIcons: { [key: string]: string } = {
    // Frontend
    HTML: "🌐",
    CSS: "🎨",
    JavaScript: "🟨",
    "React.js": "⚛️",
    "Vue.js": "💚",
    Angular: "🔴",
    TypeScript: "🔷",
    "Tailwind CSS": "💨",
    Bootstrap: "🅱️",
    Sass: "💗",
    "Styled Components": "💅",

    // Backend
    "Node.js": "🟢",
    "Express.js": "🚂",
    Django: "🐍",
    FastAPI: "⚡",
    Python: "🐍",
    PHP: "🐘",
    Java: "☕",
    "C#": "🔷",

    // Databases
    PostgreSQL: "🐘",
    MySQL: "🐬",
    MongoDB: "🍃",
    SQLite: "📦",
    Redis: "🔴",
    "Firebase Firestore": "🔥",
    Supabase: "🟢",

    // Version Control
    GitHub: "🐙",
    GitLab: "🦊",
    Bitbucket: "🪣",
    Git: "📝",

    // DevOps & Cloud
    Docker: "🐳",
    Kubernetes: "⚓",
    AWS: "🟠",
    "Google Cloud": "🌤️",
    Azure: "🔵",
    DigitalOcean: "🌊",
    Vercel: "▲",
    Netlify: "🟢",
    Heroku: "🟣",
    Jenkins: "👨‍🏭",
    "CI/CD": "🔁",
    "Bash scripting": "💻",
    Linux: "🐧",
    Nginx: "🟢",
    Apache: "🪶",

    // Design
    Figma: "🎨",
    "Adobe XD": "🎭",
    Sketch: "💎",
    "Adobe Creative Suite": "🎨",
    Photoshop: "🖼️",
    Illustrator: "✏️",

    // Mobile
    Flutter: "🦋",
    Dart: "🎯",
    "React Native": "📱",
    Swift: "🍎",
    Kotlin: "🤖",
    Firebase: "🔥",

    // Other Tools
    Webpack: "📦",
    Vite: "⚡",
    NPM: "📦",
    ESLint: "🔍",
    "User Research": "🔍",
    Wireframing: "📐",
    Prototyping: "🧪",
    "Usability Testing": "✅",
    "Component Libraries": "🧩",
    "Style Guides": "📋",
    "Brand Guidelines": "🎯",
    "REST APIs": "🔌",
    GraphQL: "📊",
    "JWT Authentication": "🔐",
    "API Documentation": "📚",
    "Google Play Console": "🤖",
    "App Store Connect": "🍎",
    Prometheus: "📊",
    Grafana: "📈",
    "SSL/TLS": "🔒",
    "Firewall Configuration": "🛡️",
  };

  return techIcons[techName] || "⚙️";
};
