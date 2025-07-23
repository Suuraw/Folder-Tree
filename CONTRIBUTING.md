# 🤝 Contributing to Folder Tree

Thank you for your interest in improving **Folder Tree**! Whether it’s a bug fix, new feature, or better docs — every contribution counts. Let’s build something awesome together. 🚀

---

## 🧭 Project Structure

Here’s a quick look at the repo layout:

```
.
├── .vscode/               # Debug configuration
├── images/                # Demo GIFs and assets
├── node_modules/          # Dependencies
├── test/                  # Test files for extension
├── .gitignore
├── .vscodeignore
├── vscode-test.mjs        # VS Code testing entry
├── CHANGELOG.md
├── CONTRIBUTING.md
├── eslint.config.mjs
├── extension.js           # Main extension logic
├── jsconfig.json
├── package.json           # Extension manifest
├── package-lock.json
├── README.md
└── vsc-extension-quickstart.md
```

---

## 🛠️ Setup Instructions

1. **Clone the repo**:

   ```bash
   git clone https://github.com/YOUR-USERNAME/Folder-Tree.git
   cd Folder-Tree
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Open in VS Code**:

   ```bash
   code .
   ```

4. Press `F5` to launch a new **Extension Development Host**.

---

## 🚧 Working on the Extension

- Main logic: `extension.js`
- Configuration: `package.json`
- Testing: `test/` and `vscode-test.mjs`
- Static assets: `images/`
- Marketplace metadata: `README.md`, `CHANGELOG.md`

Use ESLint (`eslint.config.mjs`) to follow consistent formatting. Run:

```bash
npx eslint extension.js
```

---

## 🧪 Testing Your Changes

To test:

- Make changes in `extension.js`
- Run the extension (`F5`)
- Open a workspace and trigger the command via **Command Palette**

You can also write test files in the `test/` directory and integrate with the `vscode-test` runner defined in `vscode-test.mjs`.

---

## ✅ Guidelines for Contributions

### Bug Fixes 🐞

- Clearly describe the bug and steps to reproduce it (if possible).
- Link to the related issue in your pull request.

### Features ✨

- Discuss via GitHub Issue first, unless it’s small or obvious.
- Keep PRs focused. One feature or fix per PR is ideal.

### Documentation 📝

- Improve existing docs or write missing explanations.
- If you add features, update `README.md` and `CHANGELOG.md`.

---

## 🔁 Pull Request Process

1. Create a branch:

   ```bash
   git checkout -b feat/your-feature-name
   ```

2. Commit your changes using [Conventional Commits](https://www.conventionalcommits.org/):

   ```bash
   git commit -m "feat: add new format support"
   ```

3. Push and open a Pull Request:
   ```bash
   git push origin feat/your-feature-name
   ```

---

## 🙌 Thank You

Your time and effort help make Folder Tree better for everyone.  
Star the repo ⭐, share it with others, and feel free to reach out or open issues!

---
