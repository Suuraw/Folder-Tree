# 📁 Generate Folder Tree

<div align="center">

[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/Suuraw.generate-folder-tree?style=for-the-badge&label=Marketplace)](https://marketplace.visualstudio.com/items?itemName=Suuraw.generate-folder-tree)
[![License](https://img.shields.io/github/license/Suuraw/Generate-Folder-Tree?style=for-the-badge&color=blue)](LICENSE)

</div>

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

1.  **Install** the [Generate Folder Tree](https://marketplace.visualstudio.com/items?itemName=Suuraw.generate-folder-tree) extension.
2.  **Open an empty folder** in VS Code. This will be the root directory.
3.  Open the **Command Palette** (`Ctrl+Shift+P` or `Cmd+Shift+P`).
4.  Type and select the command: **`Generate Folder Tree`**.
5.  An input panel will appear at the top. **Type or paste your structure** in this panel.
6.  Press **`Enter`**. The structure is instantly created. 💥

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

## 💝 Support

<div align="center">

_Love this extension?_ Help it grow by showing your support!

[![Star on GitHub](https://img.shields.io/badge/⭐_Star_on_GitHub-black?style=for-the-badge&logo=github)](https://github.com/Suuraw/Generate-Folder-Tree)
[![Rate on Marketplace](https://img.shields.io/badge/📝_Rate_on_Marketplace-blue?style=for-the-badge&logo=visualstudiocode)](https://marketplace.visualstudio.com/items?itemName=Suuraw.generate-folder-tree)
[![Share on Twitter](https://img.shields.io/badge/🐦_Share_on_Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/intent/tweet?text=Scaffold%20project%20structures%20instantly%20in%20%40vscode%20with%20the%20'Generate%20Folder%20Tree'%20extension!&url=https://marketplace.visualstudio.com/items?itemName=Suuraw.generate-folder-tree)

</div>

---

## 📄 License

This extension is licensed under the MIT License.
