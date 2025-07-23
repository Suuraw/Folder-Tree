# 📁 Folder Tree

Quickly generate project folder and file structures from simple text outlines in VS Code. Stop manually creating files and folders one by one and start defining your entire project architecture in a single file.

![Demo of Folder Tree](https://raw.githubusercontent.com/Suuraw/Folder-Tree/main/User-guide-demo.gif)

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

1. **Install** the "Folder Tree" extension from the [VS Code Marketplace](https://marketplace.visualstudio.com/).
2. **Create a new file** in your workspace root (e.g., `.tree`).
3. **Define your structure** in one of the supported formats (see below).  
   ➤ **To define a folder**, end its name with a forward slash (`/`).
4. Open the **Command Palette** (`Ctrl+Shift+P` or `Cmd+Shift+P`).
5. Run the command: **`Folder Tree: Generate Structure`**.
6. Boom 💥 — your folders and files are scaffolded instantly.

---

## ✏️ Supported Formats

### 1. Markdown Tree Format (`|--`)

<pre>
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
</pre>

---

### 2. Indentation Format (spaces or tabs)

<pre>
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
</pre>

---

### 3. Bullet Point Format (`*` or `-`)

<pre>
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
</pre>

---

## ⚙️ Extension Settings

You can configure Folder Tree in your `settings.json`:

<pre>
folderTree.overwriteExisting: When set to true, the extension will overwrite existing files with the same name. Defaults to false.

folderTree.ignoreFileName: The name of the file containing the structure definition, to prevent it from trying to create itself. Defaults to .tree.
</pre>

---

## 🧾 Release Notes

### 1.0.0

- Initial release of **Folder Tree**.
- Supports Markdown Tree, Indentation, and Bullet Point formats.
- Added command: `Folder Tree: Generate Structure`.

---

## 🤝 Contributing

Found a bug or have a feature request?  
Please open an issue or submit a pull request on our [GitHub Repository](https://github.com/Suuraw/Folder-Tree).

---

## 📄 License

This extension is licensed under the MIT License.
