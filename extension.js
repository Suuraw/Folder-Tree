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

  // Show input panel immediately when extension activates
  //   showInputPanel(context);

  // The command has been defined in the package.json file
  const disposable = vscode.commands.registerCommand(
    "helloworld.helloWorld",
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
          handleMDTreeCreation(message.mdTree);
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

    // Parse the MD tree structure
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
 * Parses markdown tree structure using regex and identifies nesting
 * @param {string} mdTree - Raw markdown tree text
 * @returns {Array} Parsed tree structure with paths and types
 */
function parseMDTree(mdTree) {
  const lines = mdTree.split("\n").filter((line) => line.trim() !== "");
  const structure = [];
  const pathStack = [];

  // Regex patterns for different tree formats
  const patterns = {
    // Standard tree format: ├──, └──, │
    standard: /^(\s*)(├──|└──|│\s*├──|│\s*└──|\|--|\+--|--)?\s*(.+)$/,
    // Simple indentation format
    indent: /^(\s+)(.+)$/,
    // Bullet points
    bullet: /^(\s*)([-*+])\s*(.+)$/,
    // Numbered lists
    numbered: /^(\s*)(\d+\.)\s*(.+)$/,
  };

  for (let line of lines) {
    line = line.replace(/\r/g, ""); // Remove carriage returns

    if (!line.trim()) continue;

    let match = null;
    let indentLevel = 0;
    let content = "";

    // Try different patterns
    if ((match = line.match(patterns.standard))) {
      const indent = match[1] || "";
      const symbol = match[2] || "";
      content = match[3].trim();

      // Calculate indent level based on spaces and symbols
      indentLevel = Math.floor(indent.length / 2);
      if (symbol.includes("│")) indentLevel++;
    } else if ((match = line.match(patterns.bullet))) {
      indentLevel = Math.floor(match[1].length / 2);
      content = match[3].trim();
    } else if ((match = line.match(patterns.numbered))) {
      indentLevel = Math.floor(match[1].length / 2);
      content = match[3].trim();
    } else if ((match = line.match(patterns.indent))) {
      indentLevel = Math.floor(match[1].length / 2);
      content = match[2].trim();
    } else {
      // No indentation, treat as root level
      content = line.trim();
      indentLevel = 0;
    }

    if (!content) continue;

    // Clean up content - remove tree symbols and extra spaces
    content = content.replace(/^[├└│\-\+\|]*\s*/, "").trim();

    // Skip empty content
    if (!content) continue;

    // Adjust path stack based on current indent level
    while (pathStack.length > indentLevel) {
      pathStack.pop();
    }

    // Determine if it's a file or folder
    const isFile = hasFileExtension(content);

    // Build full path
    const fullPath =
      pathStack.length > 0 ? path.join(...pathStack, content) : content;

    // Add to structure
    structure.push({
      name: content,
      path: fullPath,
      type: isFile ? "file" : "folder",
      level: indentLevel,
    });

    // Add to path stack if it's a folder
    if (!isFile) {
      pathStack[indentLevel] = content;
    }

    console.log(
      `Parsed: ${content} (level: ${indentLevel}, type: ${
        isFile ? "file" : "folder"
      }, path: ${fullPath})`
    );
  }

  return structure;
}

/**
 * Determines if a name represents a file based on file extension
 * @param {string} name - The file/folder name
 * @returns {boolean} True if it's a file
 */
function hasFileExtension(name) {
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
  // Sort structure by path depth to create parent folders first
  structure.sort((a, b) => a.level - b.level);

  for (const item of structure) {
    const fullPath = path.join(basePath, item.path);

    try {
      if (item.type === "folder") {
        // Create directory
        if (!fs.existsSync(fullPath)) {
          fs.mkdirSync(fullPath, { recursive: true });
          console.log(`✅ Created folder: ${item.path}`);
        } else {
          console.log(`📁 Folder already exists: ${item.path}`);
        }
      } else {
        // Create file
        const fileDir = path.dirname(fullPath);

        // Ensure parent directory exists
        if (!fs.existsSync(fileDir)) {
          fs.mkdirSync(fileDir, { recursive: true });
        }

        // Create file if it doesn't exist
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
            }
            
            .example pre {
                background-color: var(--vscode-textPreformat-background);
                padding: 10px;
                border-radius: 3px;
                overflow-x: auto;
                font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
                font-size: 12px;
                margin: 10px 0;
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
                    placeholder="Paste your folder tree here...

Example formats supported:
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   └── Footer.jsx
│   ├── utils/
│   │   └── helpers.js
│   └── index.js
├── public/
│   └── index.html
└── package.json

Or simple indentation:
  src/
    components/
      Header.jsx
      Footer.jsx
    utils/
      helpers.js
    index.js
  public/
    index.html
  package.json

Or bullet points:
- src/
  - components/
    - Header.jsx
    - Footer.jsx
  - utils/
    - helpers.js
  - index.js
- public/
  - index.html
- package.json"
                ></textarea>
            </div>
            
            <div class="example">
                <h3>📋 Supported Formats:</h3>
                <p>The extension automatically detects and supports various tree formats:</p>
                
                <p><strong>1. Standard Tree Format:</strong></p>
                <pre>├── folder/
│   ├── subfolder/
│   │   └── file.txt
│   └── another-file.js
└── root-file.md</pre>
                
                <p><strong>2. Simple Indentation:</strong></p>
                <pre>folder/
    subfolder/
        file.txt
    another-file.js
root-file.md</pre>
                
                <p><strong>3. Bullet Points:</strong></p>
                <pre>- folder/
  - subfolder/
    - file.txt
  - another-file.js
- root-file.md</pre>
                
                <p><strong>📝 Notes:</strong></p>
                <ul>
                    <li>Files are detected by their extensions (.js, .html, .css, etc.)</li>
                    <li>Folders can end with "/" or be detected by lack of extension</li>
                    <li>Mixed formats in the same tree are supported</li>
                    <li>Empty lines are ignored</li>
                </ul>
            </div>
            
            <div class="button-group">
                <button type="button" class="run-button" id="runButton">
                    🚀 Create Structure
                </button>
                <button type="button" class="close-button" id="closeButton">
                    ❌ Close
                </button>
            </div>
        </div>

        <script>
            const vscode = acquireVsCodeApi();
            
            const mdTreeInput = document.getElementById('mdTreeInput');
            const runButton = document.getElementById('runButton');
            const closeButton = document.getElementById('closeButton');
            
            // Focus on textarea
            mdTreeInput.focus();
            
            // Enable/disable run button based on input
            mdTreeInput.addEventListener('input', () => {
                const hasContent = mdTreeInput.value.trim().length > 0;
                runButton.disabled = !hasContent;
            });
            
            // Handle run button click
            runButton.addEventListener('click', () => {
                const mdTree = mdTreeInput.value.trim();
                
                if (!mdTree) {
                    alert('Please paste your markdown tree structure!');
                    mdTreeInput.focus();
                    return;
                }
                
                // Disable button during processing
                runButton.disabled = true;
                runButton.textContent = '⏳ Creating...';
                
                // Send data to extension
                vscode.postMessage({
                    command: 'run',
                    mdTree: mdTree
                });
                
                // Re-enable after a delay
                setTimeout(() => {
                    runButton.disabled = false;
                    runButton.textContent = '🚀 Create Structure';
                }, 3000);
            });
            
            // Handle close button click
            closeButton.addEventListener('click', () => {
                vscode.postMessage({
                    command: 'close'
                });
            });
            
            // Handle Ctrl+Enter to run
            mdTreeInput.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                    e.preventDefault();
                    if (!runButton.disabled) {
                        runButton.click();
                    }
                }
            });
            
            // Initial button state
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
