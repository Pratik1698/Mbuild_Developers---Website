# 👥 Team Collaboration Guide

This guide explains **how our team works together on this website using GitHub**.
Please read this once before starting any work.

---

## 🎯 Project Overview

* **Repository**: Mbuild_Developers---Website
* **Main Branch**: `main`
* **Type**: Static Website (HTML, CSS, JavaScript)

The `main` branch always contains **stable, reviewed code**.

---

## 🔐 Access & Permissions

* Team members are added as **Collaborators (Write access)**
* Do **NOT** push directly to `main`
* All changes must come through **Pull Requests (PRs)**

---

## 🧑‍💻 First-Time Setup (One-Time Only)

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Pratik1698/Mbuild_Developers---Website.git
```

### 2️⃣ Open the project

```bash
cd Mbuild_Developers---Website
code .
```

### 3️⃣ Configure Git editor (important)

```bash
git config --global core.editor "code --wait"
```

---

## 🌿 Branching Rules (VERY IMPORTANT)

* ❌ Never work directly on `main`
* ✅ Create a new branch for every feature or fix

### Branch naming examples

* `contact-page`
* `navbar-fix`
* `gallery-section`
* `responsive-css`

### Create a branch

```bash
git checkout -b branch-name
```

---

## ✍️ Daily Work Process

### 1️⃣ Make changes

* Edit HTML / CSS / JS
* Save files

### 2️⃣ Check status

```bash
git status
```

### 3️⃣ Add changes

```bash
git add .
```

### 4️⃣ Commit changes

```bash
git commit -m "Short, clear description of change"
```

✅ Good commit messages:

* `Improve contact page layout`
* `Fix navbar alignment`
* `Add gallery images`

❌ Bad commit messages:

* `update`
* `changes`
* `final`

---

## 🚀 Push Your Work

Push **your branch**, not `main`:

```bash
git push origin branch-name
```

---

## 🔁 Creating a Pull Request (PR)

After pushing your branch:

1. Go to the GitHub repository
2. Click **Pull Requests** → **New Pull Request**
3. Base branch: `main`
4. Compare branch: *your branch*
5. Add description of what you changed
6. Click **Create Pull Request**

---

## 👀 Code Review & Merge (Owner Only)

* Owner reviews the PR
* May request changes
* After approval → **Merge Pull Request**

Only the owner merges into `main`.

---

## 🔄 Keeping Your Code Updated

Before starting new work:

```bash
git checkout main
git pull origin main
```

Then create a new branch again.

---

## 🚫 What NOT to Do

* ❌ Do not push directly to `main`
* ❌ Do not force-push
* ❌ Do not upload ZIP files
* ❌ Do not edit code directly on GitHub UI
* ❌ Do not change folder structure without discussion

---

## 📁 File & Folder Rules

* Use **lowercase filenames**
* Use **hyphens (-)**, not spaces
* No `C:\` paths in code
* Use relative paths only (`../assets/css/style.css`)

---

## 🧠 Simple Workflow Summary

```text
Clone → Branch → Edit → Add → Commit → Push → Pull Request
```

---

## 📞 Need Help?

* Ask before big changes
* If stuck with Git, **do not panic**
* Contact the project owner

---

✅ Following this guide keeps the project clean, safe, and professional.

Happy coding 🚀
