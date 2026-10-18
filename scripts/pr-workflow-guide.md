# 🦈 GitHub Pull Shark 3 Strategy & Guide

Welcome to the definitive guide for earning the **GitHub Pull Shark 3 (Tier 3)** achievement on your profile (`@Atahar-Shihab`) using proper GitHub conventions!

---

## 🎯 Achievement Tiers

| Tier | Badge | Required Merged PRs |
|---|---|---|
| **Tier 1 (Bronze)** | 🥉 Pull Shark | **2 merged PRs** |
| **Tier 2 (Silver)** | 🥈 Pull Shark x2 | **16 merged PRs** |
| **Tier 3 (Gold)** | 🥇 **Pull Shark 3 (x3)** | **102 merged PRs** |

---

## 🔑 Crucial Rules for GitHub to Award the Pull Shark Badge:
1. **Pull Requests must be merged into the repository's default branch** (usually `main`).
2. **Merging method**: "Squash and merge" or "Create a merge commit" both count!
3. **Automated CI checks**: The `.github/workflows/ci.yml` we configured will automatically run lint and build verification on every PR so you can merge with green checkmarks.
4. **Use branches or forks**: You can open PRs from feature branches (`feat/*`, `fix/*`, `docs/*`) into `main` directly within your own repository!

---

## 🛠️ Step-by-Step Command Workflow

### Method A: Using GitHub CLI (`gh`) for Quick PR Workflows

If you have GitHub CLI installed (`gh auth login`), you can create and merge PRs in seconds:

```bash
# 1. Create a feature branch
git checkout -b feat/educational-audio-enhancement

# 2. Make your improvements, stage and commit
git add .
git commit -m "feat(audio): add ambient fireplace audio visualizer"

# 3. Push and create PR using GitHub CLI
git push -u origin feat/educational-audio-enhancement
gh pr create --fill

# 4. Merge the PR immediately into main
gh pr merge --squash --delete-branch
```

---

### Method B: Using Git & GitHub Web Interface

```bash
# 1. Create a descriptive feature branch off main
git checkout main
git pull origin main
git checkout -b feat/literature-reading-milestones

# 2. Commit your updates
git add .
git commit -m "feat(milestones): add voracious reader tier tracking"

# 3. Push to your GitHub repository
git push -u origin feat/literature-reading-milestones
```

4. Go to [https://github.com/Atahar-Shihab/Book-Vibe](https://github.com/Atahar-Shihab/Book-Vibe) in your browser.
5. Click the green **Compare & pull request** banner.
6. The PR template `.github/pull_request_template.md` will automatically load. Fill in your checklist.
7. Click **Create pull request**.
8. Verify that the GitHub Actions CI workflow turns green ✅.
9. Click **Squash and merge** -> **Confirm squash and merge**.
10. Your GitHub Pull Shark counter increments! 🎉

---

## 💡 Recommended Feature Topics for Additional PRs
When you want to submit further PRs to reach Tier 3:
* `feat(theme)`: Add cozy parchment and dark mode themes
* `feat(search)`: Add fuzzy search matching for author names
* `feat(export)`: Add PDF/JSON export of reading history
* `feat(quizzes)`: Add 10 additional classic trivia questions
* `feat(stats)`: Add reading pace calculator (WPM)
* `fix(responsive)`: Fine-tune 3D card tilt for iPad screens
* `docs(books)`: Expand historical context for ancient classics
* `test(storage)`: Add unit tests for reading streak calculations
