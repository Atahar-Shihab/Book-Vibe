# 🤝 Contributing to Book Vibe

Thank you for your interest in contributing to **Book Vibe**! This project is an open-source, educational, 3D cinematic literature portal designed to help students, developers, and bibliophiles explore timeless literature freely.

We welcome all contributions—from fixing typos and expanding educational summaries to building novel 3D visualizers and accessibility enhancements.

---

## 🌿 Git Branching Convention

Always create feature branches off the latest `main` branch using this naming convention:

| Branch Prefix | Purpose | Example |
|---|---|---|
| `feat/` | New feature or visual capability | `feat/3d-flip-reader` |
| `fix/` | Bug fixes or corrections | `fix/audio-speech-rate` |
| `docs/` | Documentation or guide updates | `docs/contributing-guide` |
| `style/` | CSS, styling, or animation tweaks | `style/perspective-glare` |
| `perf/` | Performance optimizations | `perf/canvas-particle-rendering` |
| `refactor/` | Code structure improvements | `refactor/toast-context` |

---

## 📝 Conventional Commits Guide

Commit messages must follow the [Conventional Commits specification](https://www.conventionalcommits.org/):

```
<type>(<optional scope>): <description>

[optional body]

[optional footer]
```

### Common Types:
* `feat`: A new feature (e.g., `feat(shelf): implement 3D physical book spine perspective`)
* `fix`: A bug fix (e.g., `fix(audio): resolve web speech cancellation on unmount`)
* `docs`: Documentation updates (e.g., `docs(readme): add 3D feature architecture diagram`)
* `style`: Code style / UI styling (e.g., `style(hero): refine volumetric ambient light glow`)
* `refactor`: Code restructuring without functional change (e.g., `refactor(storage): extract streak calculation`)
* `perf`: Performance boost (e.g., `perf(particles): throttle mouse move calculations`)
* `chore`: Maintenance, dependencies, or tooling (e.g., `chore(deps): upgrade lucide-react`)

---

## 🚀 Step-by-Step Pull Request Workflow

### 1. Synchronize with Main
```bash
git checkout main
git pull origin main
```

### 2. Create your Feature Branch
```bash
git checkout -b feat/your-feature-name
```

### 3. Make Changes and Verify Code Quality
Make sure the linter and build check pass with zero errors:
```bash
npm run lint
npm run build
```

### 4. Stage and Commit with Conventional Message
```bash
git add .
git commit -m "feat(scope): describe your changes concisely"
```

### 5. Push Branch to GitHub
```bash
git push -u origin feat/your-feature-name
```

### 6. Open a Pull Request on GitHub
* Go to your repository on GitHub: `https://github.com/Atahar-Shihab/Book-Vibe`
* Click **Compare & pull request**
* Fill out the PR template with clear descriptions and testing verification
* Wait for the GitHub Actions CI checks to turn green ✅
* Merge your pull request into `main` using **Squash and merge** or **Create a merge commit**!

---

## 📋 Code Quality Standards
* Preserve documentation integrity and write descriptive docstrings.
* Use React 19 functional components and hooks appropriately.
* Use Tailwind CSS utility classes and semantic HTML elements (`<main>`, `<section>`, `<article>`, `<header>`).
* Verify that all audio components gracefully handle browser autoplay policies and mobile touch events.
