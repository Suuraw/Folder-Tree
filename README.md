# 📁 Generate Folder Tree

[![VS Code Marketplace](https://img.shields.io/visual-studio-marketplace/v/Suuraw.generate-folder-tree)](https://marketplace.visualstudio.com/items?itemName=Suuraw.generate-folder-tree)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

> 🚀 **Quickly generate project folders and files right inside VS Code**  
> ✏️ Just **paste** or **draw your structure** in the panel  
> ⚡️ Instantly create your entire project layout — no more clicking "New File" or "New Folder" again and again.

![Demo of Generate Folder Tree](https://raw.githubusercontent.com/Suuraw/Generate-Folder-Tree/main/images/Demo.gif)

---

## 🚀 Features

✅ **Rapid Scaffolding** – Generate complex directory trees in your workspace in seconds.  
✅ **Multiple Input Formats** – Use the format that feels most natural to you:

- **Markdown Tree** (`|--`)
- **Indented Text** (spaces or tabs)
- **Bullet Points** (`*` or `-`)

✅ **Simple & Intuitive** – Write your structure, run one command, and you're done.

---

## 🛠️ How to Use

1. **Install** the "Generate Folder Tree" extension from the [VS Code Marketplace](https://marketplace.visualstudio.com/).
2. **Create a new file** in your workspace root (e.g., `.tree`).
3. **Define your structure** in one of the supported formats (see below).  
   ➤ To define a **folder**, end its name with a slash (`/`).
4. Open the **Command Palette** (`Ctrl+Shift+P` or `Cmd+Shift+P`).
5. Run the command: **`Generate Folder Tree: Create from Text Outline`**.
6. Boom 💥 — your folders and files are scaffolded instantly.

---

## ✏️ Supported Formats: (Copy & Test Below)

### 1. Markdown Tree Format (`|--`)

```text
.
|-- src/
|   |-- components/
|   |   |-- Button.jsx
|   |   |-- Modal.jsx
|   |-- hooks/
|   |-- pages/
|       |-- Home.jsx
|       |-- About.jsx
|-- public/
|   |-- index.html
|-- package.json
|-- .gitignore
```

---

### 2. Indentation Format (spaces or tabs)

```text
src/
  components/
    Button.jsx
    Modal.jsx
  hooks/
  pages/
    Home.jsx
    About.jsx
public/
  index.html
package.json
.gitignore
```

---

### 3. Bullet Point Format (`*` or `-`)

```text
* src/
  * components/
    * Button.jsx
    * Modal.jsx
  * hooks/
  * pages/
    * Home.jsx
    * About.jsx
* public/
  * index.html
* package.json
* .gitignore
```

---

## ⚙️ Extension Settings

You can configure Generate Folder Tree in your `settings.json`:

<pre>
folderTree.overwriteExisting: boolean
// When true, existing files/folders with the same name will be overwritten. Default is false.

folderTree.ignoreFileName: string
// Name of the structure file to ignore when generating folders. Default is ".tree".
</pre>

---

## 🧾 Release Notes

### 0.0.1

- Initial release of **Generate Folder Tree**
- Supports Markdown Tree, Indentation, and Bullet Point formats
- Added command: `Generate Folder Tree: Create from Text Outline`

---

## 🤝 Contributing & Issues

Have a feature idea or spotted a bug? We'd love your help!

- 🐞 Report bugs by opening an [Issue](https://github.com/Suuraw/Generate-Folder-Tree/issues)
- 💡 Suggest features or improvements the same way
- 🔧 Want to contribute? Fork the repo and submit a PR — clear commits and concise messages appreciated!

Check the [Contribution Guide](https://github.com/Suuraw/Generate-Folder-Tree/blob/main/CONTRIBUTING.md).

---

## 📄 License

This extension is licensed under the MIT License.
