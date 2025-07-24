// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log(
    'Congratulations, your extension "folder-tree-generator" is now active!'
  );

  // The command has been defined in the package.json file
  const disposable = vscode.commands.registerCommand(
    "folder-tree.generate",
    function () {
      console.log("Command executed - showing input panel");
      showInputPanel(context);
    }
  );

  context.subscriptions.push(disposable);
}

/**
 * Creates and shows a custom input panel for MD tree input
 * @param {vscode.ExtensionContext} context
 */
function showInputPanel(context) {
  // Create and show a new webview panel
  const panel = vscode.window.createWebviewPanel(
    "mdTreePanel",
    "MD Tree to Folder Structure",
    vscode.ViewColumn.One,
    {
      enableScripts: true,
      localResourceRoots: [context.extensionUri],
    }
  );

  // Set the HTML content for the webview
  panel.webview.html = getWebviewContent();

  // Handle messages from the webview
  panel.webview.onDidReceiveMessage(
    (message) => {
      switch (message.command) {
        case "run":
          console.log("Processing MD tree structure...");
          // When the run command is received, we close the panel and run the creation logic.
          handleMDTreeCreation(message.mdTree);
          panel.dispose();
          return;

        case "close":
          console.log("Close button clicked");
          panel.dispose();
          return;
      }
    },
    undefined,
    context.subscriptions
  );

  // Handle panel disposal
  panel.onDidDispose(
    () => {
      console.log("MD Tree panel was closed");
    },
    null,
    context.subscriptions
  );
}

/**
 * Parses MD tree structure and creates folders/files
 * @param {string} mdTree - The markdown tree structure
 */
async function handleMDTreeCreation(mdTree) {
  try {
    // Get current workspace path
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
      vscode.window.showErrorMessage(
        "No workspace folder is open. Please open a folder first."
      );
      return;
    }

    const workspacePath = workspaceFolder.uri.fsPath;
    console.log(`Creating structure in: ${workspacePath}`);

    // Parse the MD tree structure with the new robust logic
    const parsedStructure = parseMDTree(mdTree);
    console.log("Parsed structure:", JSON.stringify(parsedStructure, null, 2));

    if (parsedStructure.length === 0) {
      vscode.window.showWarningMessage(
        "No valid folder structure found in the input."
      );
      return;
    }

    // Create the folder structure
    await createFolderStructure(workspacePath, parsedStructure);

    vscode.window.showInformationMessage(
      `✅ Folder structure created successfully in ${workspaceFolder.name}!`
    );
  } catch (error) {
    console.error("Error creating folder structure:", error);
    vscode.window.showErrorMessage(`Error: ${error.message}`);
  }
}

/**
 * **[REWRITTEN & ROBUST]**
 * Parses a string representing a file tree into a structured array of objects.
 * This new logic is more robust and handles complex/inconsistent indentation.
 *
 * @param {string} mdTree - The string containing the file tree.
 * @returns {Array<Object>} An array where each object represents a file or folder.
 */
function parseMDTree(mdTree) {
  const lines = mdTree.split("\n").filter((line) => line.trim() !== "");
  const structure = [];

  // parentStack holds the names of the parent folders. e.g., ['src', 'components']
  const parentStack = [];
  // indentStack holds the indentation length for each level in parentStack.
  const indentStack = [-1]; // Root level has -1 indentation.

  // This regex greedily captures all prefix characters (whitespace, tree symbols)
  // in the first group, leaving the clean content in the second group.
  const lineParser = /^([ |│├└─\t*+-]*)(.*)/;
  for (const line of lines) {
    const match = line.match(lineParser);
    if (!match) continue;

    const prefix = match[1] || "";
    let content = (match[2] || "").trim();

    if (!content) continue;

    // The raw length of the prefix is our indentation metric.
    // This is more reliable than counting spaces or detecting indent size.
    const indentLength = prefix.length;

    // Pop from the stacks until we find the correct parent level.
    // The parent is the last item in the stack with less indentation.
    while (indentLength <= indentStack[indentStack.length - 1]) {
      parentStack.pop();
      indentStack.pop();
    }

    // The current item's level is its position in the hierarchy.
    const level = parentStack.length;

    // Determine type and get a clean name for the path
    const isFile = hasFileExtension(content);
    const type = isFile ? "file" : "folder";
    const cleanName = content.endsWith("/") ? content.slice(0, -1) : content;

    // Build the full path using the current parent stack
    const fullPath = path.join(...parentStack, cleanName);

    structure.push({
      name: content,
      path: fullPath,
      type: type,
      level: level,
    });

    // If it's a folder, add it to the stacks so it can be a parent
    // for subsequent, more indented lines.
    if (!isFile) {
      parentStack.push(cleanName);
      indentStack.push(indentLength);
    }
  }

  return structure;
}

/**
 * Determines if a name represents a file based on a comprehensive list of extensions.
 * Also handles names ending in '/' as folders.
 * @param {string} name - The file/folder name
 * @returns {boolean} True if it's a file
 */
function hasFileExtension(name) {
  // If it explicitly ends with a slash, it's a folder.
  if (name.endsWith("/")) {
    return false;
  }

  // List of common file extensions from the original extension code.
  const fileExtensions = [
    ".js",
    ".ts",
    ".jsx",
    ".tsx",
    ".vue",
    ".py",
    ".java",
    ".cpp",
    ".c",
    ".h",
    ".html",
    ".css",
    ".scss",
    ".sass",
    ".less",
    ".json",
    ".xml",
    ".yaml",
    ".yml",
    ".md",
    ".txt",
    ".csv",
    ".log",
    ".env",
    ".gitignore",
    ".dockerignore",
    ".php",
    ".rb",
    ".go",
    ".rs",
    ".swift",
    ".kt",
    ".dart",
    ".scala",
    ".sql",
    ".sh",
    ".bat",
    ".ps1",
    ".dockerfile",
    ".makefile",
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".svg",
    ".ico",
    ".pdf",
    ".zip",
    ".tar",
    ".gz",
    ".rar",
    ".7z",
  ];

  // Check if the name ends with any of the known extensions.
  return fileExtensions.some((ext) =>
    name.toLowerCase().endsWith(ext.toLowerCase())
  );
}

/**
 * Creates the folder structure on the file system
 * @param {string} basePath - Base workspace path
 * @param {Array} structure - Parsed structure array
 */
async function createFolderStructure(basePath, structure) {
  for (const item of structure) {
    const fullPath = path.join(basePath, item.path);

    try {
      if (item.type === "folder") {
        if (!fs.existsSync(fullPath)) {
          fs.mkdirSync(fullPath, {
            recursive: true,
          });
          console.log(`✅ Created folder: ${item.path}`);
        } else {
          console.log(`📁 Folder already exists: ${item.path}`);
        }
      } else {
        // item.type is "file"
        const fileDir = path.dirname(fullPath);
        if (!fs.existsSync(fileDir)) {
          fs.mkdirSync(fileDir, {
            recursive: true,
          });
        }
        if (!fs.existsSync(fullPath)) {
          fs.writeFileSync(fullPath, "", "utf8");
          console.log(`✅ Created file: ${item.path}`);
        } else {
          console.log(`📄 File already exists: ${item.path}`);
        }
      }
    } catch (error) {
      console.error(`❌ Error creating ${item.type}: ${item.path}`, error);
      throw new Error(
        `Failed to create ${item.type}: ${item.path} - ${error.message}`
      );
    }
  }
}

/**
 * Returns the HTML content for the webview panel
 * @returns {string} HTML content
 */
function getWebviewContent() {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>MD Tree to Folder Structure</title>
        <style>
            body {
                font-family: var(--vscode-font-family);
                font-size: var(--vscode-font-size);
                color: var(--vscode-foreground);
                background-color: var(--vscode-editor-background);
                padding: 20px;
                margin: 0;
                line-height: 1.5;
            }
            
            .container {
                max-width: 800px;
                margin: 0 auto;
            }
            
            h1 {
                color: var(--vscode-foreground);
                margin-bottom: 10px;
                text-align: center;
                font-size: 24px;
            }
            
            .subtitle {
                text-align: center;
                color: var(--vscode-descriptionForeground);
                margin-bottom: 30px;
                font-style: italic;
            }
            
            .form-group {
                margin-bottom: 20px;
            }
            
            label {
                display: block;
                margin-bottom: 8px;
                font-weight: bold;
                color: var(--vscode-foreground);
            }
            
            textarea {
                width: 100%;
                min-height: 300px;
                padding: 12px;
                border: 1px solid var(--vscode-input-border);
                background-color: var(--vscode-input-background);
                color: var(--vscode-input-foreground);
                font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
                font-size: 14px;
                box-sizing: border-box;
                border-radius: 4px;
                resize: vertical;
                line-height: 1.4;
            }
            
            textarea:focus {
                outline: 1px solid var(--vscode-focusBorder);
                border-color: var(--vscode-focusBorder);
            }
            .copy-btn {
                background: var(--vscode-button-secondaryBackground);
                color: var(--vscode-button-secondaryForeground);
                border: 1px solid var(--vscode-button-border);
                padding: 0.25rem 0.75rem;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                font-weight: 500;
                transition: all 0.2s ease;
            }

            .copy-btn:hover {
                background: var(--vscode-button-secondaryHoverBackground);
            }
            .example {
                background-color: var(--vscode-textBlockQuote-background);
                border-left: 4px solid var(--vscode-textBlockQuote-border);
                padding: 15px;
                margin: 20px 0;
                border-radius: 4px;
                font-size: 13px;
            }
            
            .example h3 {
                margin-top: 0;
                margin-bottom: 10px;
                color: var(--vscode-foreground);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .example pre {
                background-color: var(--vscode-textPreformat-background);
                padding: 10px;
                border-radius: 3px;
                overflow-x: auto;
                font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
                font-size: 12px;
                margin: 10px 0;
                white-space: pre;
            }
            
            .button-group {
                display: flex;
                gap: 15px;
                justify-content: center;
                margin-top: 30px;
            }
            
            button {
                padding: 12px 24px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-family: inherit;
                font-size: 14px;
                font-weight: 500;
                min-width: 100px;
                transition: all 0.2s ease;
            }
            
            .run-button {
                background-color: var(--vscode-button-background);
                color: var(--vscode-button-foreground);
            }
            
            .run-button:hover:not(:disabled) {
                background-color: var(--vscode-button-hoverBackground);
                transform: translateY(-1px);
            }
            
            .run-button:disabled {
                opacity: 0.6;
                cursor: not-allowed;
            }
            
            .close-button {
                background-color: var(--vscode-button-secondaryBackground);
                color: var(--vscode-button-secondaryForeground);
                border: 1px solid var(--vscode-button-border);
            }
            
            .close-button:hover {
                background-color: var(--vscode-button-secondaryHoverBackground);
                transform: translateY(-1px);
            }
            
            .warning {
                background-color: var(--vscode-inputValidation-warningBackground);
                border: 1px solid var(--vscode-inputValidation-warningBorder);
                color: var(--vscode-inputValidation-warningForeground);
                padding: 12px;
                border-radius: 4px;
                margin-bottom: 20px;
                font-size: 13px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>📁 MD Tree to Folder Structure</h1>
            <div class="subtitle">Paste your markdown folder tree and create the actual folder structure</div>
            
            <div class="warning">
                <strong>⚠️ Warning:</strong> This will create folders and files in your current workspace. Make sure you have the correct workspace open.
            </div>
            
            <div class="form-group">
                <label for="mdTreeInput">Paste your Markdown Tree Structure:</label>
                <textarea 
                    id="mdTreeInput" 
                    name="mdTreeInput" 
                    placeholder="Paste your folder tree here..."
                ></textarea>
            </div>
            
            <div class="example">
                <h3>
                    <span>📋 Supported Formats:</span>
                </h3>
                <p>The extension automatically detects and supports various tree formats:</p>
                
                <h3>
                    <span><strong>1. Standard Tree Format:</strong></span>
                    <button class="copy-btn" data-target="format-code-1">Copy</button>
                </h3>
                <pre id="format-code-1">
.
|-- src/
|   |-- components/
|   |   |-- Button.js
|   |-- index.js
|-- public/
|-- .gitignore
|-- package.json</pre>
                
                <h3>
                    <span><strong>2. Simple Indentation:</strong></span>
                    <button class="copy-btn" data-target="format-code-2">Copy</button>
                </h3>
                <pre id="format-code-2">folder/
    subfolder/
        file.txt
    another-file.js
root-file.md</pre>
                
                <h3>
                    <span><strong>3. Bullet Points:</strong></span>
                    <button class="copy-btn" data-target="format-code-3">Copy</button>
                </h3>
                <pre id="format-code-3">- folder/
  - subfolder/
    - file.txt
  - another-file.js
- root-file.md</pre>
                
                <h3><strong>📝 Notes:</strong></h3>
                <ul>
                    <li>Files are detected by their extensions (.js, .html, .css, etc.)</li>
                    <li>Folders can end with "/" or be detected by lack of extension</li>
                    <li>Mixed formats in the same tree are supported</li>
                    <li>Empty lines are ignored</li>
                </ul>
            </div>
            
            <div class="button-group">
                <button type="button" class="run-button" id="runButton">
                    Create Structure
                </button>
                <button type="button" class="close-button" id="closeButton">
                    Close
                </button>
            </div>
        </div>

        <script>
            const vscode = acquireVsCodeApi();
            
            const mdTreeInput = document.getElementById('mdTreeInput');
            const runButton = document.getElementById('runButton');
            const closeButton = document.getElementById('closeButton');
            
            mdTreeInput.focus();
            
            mdTreeInput.addEventListener('input', () => {
                runButton.disabled = mdTreeInput.value.trim().length === 0;
            });
            
            runButton.addEventListener('click', () => {
                const mdTree = mdTreeInput.value.trim();
                if (!mdTree) return;
                
                runButton.disabled = true;
                runButton.textContent = '⏳ Creating...';
                
                vscode.postMessage({ command: 'run', mdTree: mdTree });
            });
            
            closeButton.addEventListener('click', () => {
                vscode.postMessage({ command: 'close' });
            });
            
            mdTreeInput.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                    e.preventDefault();
                    if (!runButton.disabled) {
                        runButton.click();
                    }
                }
            });

            document.querySelectorAll('.copy-btn').forEach(button => {
                button.addEventListener('click', (event) => {
                    const targetId = event.currentTarget.dataset.target;
                    const codeElement = document.getElementById(targetId);
                    const textToCopy = codeElement.textContent;

                    navigator.clipboard.writeText(textToCopy).then(() => {
                        const originalText = button.textContent;
                        button.textContent = 'Copied!';
                        setTimeout(() => {
                            button.textContent = originalText;
                        }, 1500);
                    }).catch(err => {
                        console.error('Failed to copy text: ', err);
                    });
                });
            });
            
            runButton.disabled = true;
        </script>
    </body>
    </html>
  `;
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
