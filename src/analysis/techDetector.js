/**
 * Technology Category Detector
 * Maps repository signals (language, topics, name, description) to engineering categories.
 */

import fs from 'node:fs';
import path from 'node:path';

/**
 * Load tech mapping configuration.
 */
function loadTechMapping() {
  try {
    const configPath = path.resolve(process.cwd(), 'config/tech-mapping.json');
    if (fs.existsSync(configPath)) {
      return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    }
  } catch {
    // fallback default
  }

  return {
    categories: {
      Backend: {
        languages: ["JavaScript", "TypeScript", "Python", "Java", "Go", "Rust", "C#", "Ruby", "PHP", "Kotlin"],
        topics: ["backend", "api", "rest", "graphql", "server", "microservices", "express", "fastapi", "django"]
      },
      Frontend: {
        languages: ["HTML", "CSS", "SCSS", "Vue", "Svelte"],
        topics: ["frontend", "ui", "ux", "react", "nextjs", "vue", "tailwind", "vite", "web"]
      },
      Databases: {
        languages: ["SQL", "PLpgSQL"],
        topics: ["database", "sql", "postgresql", "postgres", "mongodb", "mysql", "redis", "sqlite", "prisma"]
      },
      "AI/ML": {
        languages: ["Jupyter Notebook", "Python", "R"],
        topics: ["ai", "machine-learning", "deep-learning", "nlp", "llm", "rag", "pytorch", "tensorflow"]
      },
      Cloud: {
        languages: ["HCL"],
        topics: ["cloud", "aws", "gcp", "azure", "serverless", "lambda", "terraform"]
      },
      DevOps: {
        languages: ["Dockerfile", "Shell", "PowerShell"],
        topics: ["devops", "docker", "kubernetes", "ci-cd", "github-actions", "monitoring"]
      },
      Systems: {
        languages: ["C", "C++", "Rust", "Assembly", "Zig"],
        topics: ["systems", "embedded", "os", "operating-system", "compiler", "networking", "kernel", "cli"]
      },
      "Developer Tools": {
        languages: [],
        topics: ["cli", "devtools", "automation", "generator", "utility", "tooling"]
      }
    }
  };
}

/**
 * Detect categories associated with a single repository.
 * @param {Object} repo
 * @returns {string[]}
 */
export function detectRepoCategories(repo) {
  const mapping = loadTechMapping();
  const detected = new Set();

  const repoLang = (repo.language || '').toLowerCase();
  const repoTopics = (repo.topics || []).map(t => t.toLowerCase());
  const repoText = `${repo.name || ''} ${repo.description || ''}`.toLowerCase();

  for (const [category, rules] of Object.entries(mapping.categories)) {
    // Check language match
    const langMatch = (rules.languages || []).some(l => l.toLowerCase() === repoLang);
    if (langMatch) {
      detected.add(category);
    }

    // Check topic matches
    const topicMatch = (rules.topics || []).some(t => {
      const topicLower = t.toLowerCase();
      return repoTopics.includes(topicLower) || repoText.includes(topicLower);
    });

    if (topicMatch) {
      detected.add(category);
    }
  }

  // Fallback defaults
  if (detected.size === 0) {
    if (['javascript', 'typescript'].includes(repoLang)) {
      detected.add('Backend');
      detected.add('Frontend');
    } else if (['python', 'java', 'go', 'ruby'].includes(repoLang)) {
      detected.add('Backend');
    } else if (['c', 'c++', 'rust'].includes(repoLang)) {
      detected.add('Systems');
    } else {
      detected.add('Developer Tools');
    }
  }

  return Array.from(detected);
}

/**
 * Calculate Engineering DNA category distribution percentages.
 * @param {Array<Object>} repos
 * @returns {Array<{ category: string, count: number, percentage: number }>}
 */
export function calculateEngineeringDNA(repos) {
  const categoryCounts = {
    Backend: 0,
    Frontend: 0,
    Databases: 0,
    'AI/ML': 0,
    Cloud: 0,
    DevOps: 0,
    Systems: 0,
    'Developer Tools': 0
  };

  let totalSignalHits = 0;

  for (const repo of repos) {
    const categories = detectRepoCategories(repo);
    for (const cat of categories) {
      if (categoryCounts[cat] !== undefined) {
        categoryCounts[cat] += 1;
        totalSignalHits += 1;
      }
    }
  }

  if (totalSignalHits === 0) {
    // If no signals, provide a clean default distribution
    return [
      { category: 'Backend', count: 1, percentage: 40 },
      { category: 'Frontend', count: 1, percentage: 30 },
      { category: 'Systems', count: 1, percentage: 15 },
      { category: 'AI/ML', count: 1, percentage: 15 }
    ];
  }

  const result = Object.entries(categoryCounts)
    .filter(([_, count]) => count > 0)
    .map(([category, count]) => ({
      category,
      count,
      percentage: Math.round((count / totalSignalHits) * 100)
    }))
    .sort((a, b) => b.percentage - a.percentage);

  return result;
}
