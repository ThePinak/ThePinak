# PINAK.OS — Configuration Guide & Schema Reference

You can customize your profile by editing [`config/profile.json`](file:///d:/Real%20Project/GithubReadme/config/profile.json).

Comments (`// ...`) are supported directly inside [`config/profile.json`](file:///d:/Real%20Project/GithubReadme/config/profile.json).

---

## Full Reference Template with Explanations

```jsonc
{
  // Basic Identity
  "name": "Pinak Thummar",
  "username": "ThePinak",                    // Your GitHub username
  "headline": "Software Engineer in Progress",
  "tagline": "Build → Learn → Ship → Improve",
  "bio": "Intelligence Thrives in isolation.",

  // Current Focus in the Mission Card
  "currentMission": "BETTER THAN YESTERDAY",

  // What you are currently learning (leave as [] to hide)
  "currentlyLearning": [
    "System Design",
    "Backend Engineering",
    "Machine Learning"
  ],

  // What you are currently building (leave as [] to hide)
  "currentlyBuilding": [
    "PINAK.OS",
    "DBMS Normalization"
  ],

  // Focus areas shown in $ focus terminal session
  "interests": [
    "Software Engineering",
    "Backend Systems",
    "AI Systems",
    "Distributed Systems"
  ],

  // Social Links in Hero header (set to "" to hide)
  "social": {
    "github": "https://github.com/ThePinak",
    "linkedin": "https://linkedin.com/in/pinakthummar",
    "portfolio": "https://pinakthummar.dev",
    "email": "pinakthummar@example.com"
  },

  // -------------------------------------------------------------
  // FEATURED PROJECTS PLACEHOLDER FORMAT
  // -------------------------------------------------------------
  // Set to [] for 100% AUTOMATIC detection from your GitHub repos.
  //
  // Or add custom pinned projects using this format:
  "featuredRepositories": [
    /*
    {
      "name": "repo-name",                               // Exact repo name on GitHub
      "displayName": "CUSTOM TITLE",                     // Card Title (e.g. "MY PROJECT")
      "icon": "",                                        // Optional icon / prefix
      "description": "Short description of project",     // Description displayed in box
      "technologies": ["Node.js", "PostgreSQL"],         // Tech stack array
      "liveUrl": "https://my-demo.vercel.app",           // Optional live demo URL (leave "" if none)
      "repoUrl": "https://github.com/ThePinak/repo-name" // GitHub repo URL
    }
    */
  ],

  // Display Settings / Feature Toggles
  "settings": {
    "showTelemetry": true,           // Toggle Telemetry box
    "showEngineeringDNA": true,      // Toggle Engineering DNA distribution
    "showContributionStats": true,   // Toggle contribution statistics
    "showRecentActivity": true,      // Toggle Recent Activity timeline
    "showFeaturedProjects": true,    // Toggle Featured Projects section
    "showTerminalIntro": true,       // Toggle $ whoami interactive bash terminal
    "showPhilosophy": false,         // Toggle Philosophy section
    "showArchitecture": false,       // Toggle Architecture ASCII diagram
    "maxFeaturedProjects": 6,        // Maximum number of projects to display
    "maxRecentActivities": 5,        // Maximum recent activities to display
    "excludeForks": true             // Ignore forked repos in stats & project selection
  }
}
```
