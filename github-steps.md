# 📘 My Git & GitHub Workflow Guide

This document is a **personal step-by-step guide** explaining exactly **what I did**, **why I did it**, and **how to repeat it correctly** for this project.

It is written so that **future me** (or any teammate) can understand the full GitHub workflow without confusion.

---

## 🔁 Daily Workflow (MOST IMPORTANT)

Whenever I work on the website, I always follow this order:

```text
Edit → Save → git add → git commit → git push
```

### Commands used

```bash
git add .
git commit -m "What I changed"
git push
```

If I forget **any one step**, my code will **NOT** appear on GitHub.

---

## 1️⃣ Project Structure (Foundation)

### What I created

```text
mbuild-developers-website/
│
├── index.html
├── pages/
│   ├── Contact-Us.html
│   ├── Civil-Projects.html
│   ├── Interior-projects.html
│   ├── Our-product-Services.html
│   ├── Photo-Gallary.html
│   └── Certificates.html
│
├── assets/
│   ├── css/style.css
│   ├── js/script.js
│   └── images/favicon.png
│
└── README.md
```

### Why this structure

* Clean and professional
* Easy to maintain
* Required for GitHub Pages later

---

## 2️⃣ Fixed File Paths (Very Important)

### What I fixed

* ❌ Removed `C:\Users\...` paths
* ❌ Removed backslashes `\`
* ✅ Used relative paths with `/`

### Correct example

```html
<link rel="stylesheet" href="assets/css/style.css">
```

### Why

* Browsers and GitHub cannot read local system paths
* Websites must use relative paths

---

## 3️⃣ Initialized Git Repository

### Command used

```bash
git init
```

### Why

* Starts Git tracking
* Creates `.git` folder

---

## 4️⃣ Configured Git Identity (One Time)

### Commands used

```bash
git config --global user.name "Pratik Patil"
git config --global user.email "pratikp5598@gmail.com"
```

### Why

* Git needs author name & email for commits

---

## 5️⃣ Connected Local Project to GitHub

### Command used

```bash
git remote add origin https://github.com/Pratik1698/Mbuild_Developers---Website.git
```

### Why

* Links local folder to GitHub repository
* Enables push & pull

---

## 6️⃣ Understanding Git File Status (KEY LEARNING)

### Symbols in VS Code / Git

| Symbol    | Meaning                              |
| --------- | ------------------------------------ |
| `M`       | Modified (changed but not committed) |
| `A`       | Added (new file)                     |
| No symbol | Same as last commit                  |

### Important lesson

> **GitHub only shows committed code, not saved code.**

---

## 7️⃣ First Commit (Structure Only)

### Commands used

```bash
git add .
git commit -m "Initial website structure and base pages"
```

### What happened

* Files were created
* But content was not added yet

This is why GitHub initially showed **0 bytes files**.

---

## 8️⃣ Branch Name Fix (master → main)

### Command used

```bash
git branch -M main
```

### Why

* GitHub uses `main` as default branch

---

## 9️⃣ Handling GitHub Merge (README issue)

### What happened

* GitHub repo already had `README.md`
* Local repo did not
* Git required merge

### Command used

```bash
git pull origin main --allow-unrelated-histories
```

### Result

* README merged successfully
* Local and remote histories aligned

---

## 🔟 Avoiding Vim Confusion (IMPORTANT FIX)

### Problem

* Git opened Vim editor during merge

### Permanent fix

```bash
git config --global core.editor "code --wait"
```

### Result

* Git now uses **VS Code**, not Vim

---

## 1️⃣1️⃣ Adding REAL Website Content

### What I did

* Added HTML content
* Added CSS styles
* Modified multiple pages

Git showed:

```text
M index.html
M assets/css/style.css
```

This meant **content was ready but not committed yet**.

---

## 1️⃣2️⃣ Final Content Commit

### Commands used

```bash
git add .
git commit -m "Add website content and styles"
git push
```

### Result

* GitHub finally showed real code
* No more empty files

---

## ✅ How I Verify Everything Is OK

### Command

```bash
git status
```

### Correct output

```text
On branch main
nothing to commit, working tree clean
```

This means **local and GitHub are fully in sync**.

---

## 🎯 Final Outcome

* Code is properly version-controlled
* GitHub shows real HTML & CSS
* Safe for team collaboration
* Ready for GitHub Pages deployment

---

## 🧠 Golden Rule (Never Forget)

> **If it’s not committed, it’s not on GitHub.**

---

✍️ Author: Pratik Patil
📅 Project: MBuild Developers Website

🚀 This guide documents the complete Git journey for this project.
