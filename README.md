# vscode-mmarked-extenstion

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## 🌟 Introduction

The **MMarked** is a Visual Studio Code extension that provides real-time previews of Markdown files with enhanced LaTeX support using [@mathcrowd/mmarked](https://github.com/mathedu4all/mmarked).

This extension is designed for educators, students, and anyone who needs to visualize mathematical expressions and custom Markdown syntax in their documentation.

## 📦 Features

- ✅ Full CommonMark syntax support: Comprehensive compatibility with CommonMark standards.
- 🔢 Footnotes Blocks: Supports rendering auto-numbered footnotes with easy reference links.
- 📘 Theorem-like blocks: Supports rendering mathematical theorems, lemmas, and examples in a block format with titles, auto-numbering, and reference links.
- 🖼️ Image resizing capabilities: Allows for customizable rendering of images and videos using simple syntax.
- 🔍 Hidden/show solution blocks: Provides a solution block with a toggle button for easy visibility control, implemented with straightforward syntax.
- 🧮 TeX to SVG conversion: Converts TeX equations to scalable vector graphics for high-quality rendering.
- 🌗 Dark/Light Theme CSS: Customizable theme support for dark and light modes to enhance readability and user experience.
- ⚡ Real-Time Preview: Enables instant visual feedback while editing, making content creation and adjustments faster and more intuitive.

## 🚀 Quick Start

### Installation

1. Open Visual Studio Code.
2. Go to the Extensions view (click on the Extensions icon in the sidebar or use the shortcut `Ctrl+Shift+X`).
3. Search for **mmarked** in the search box.
4. Click the Install button.

### Usage Example

To preview your Markdown document with LaTeX support:

1. Open a Markdown file (`.md`).
2. Use the command palette (`Ctrl+Shift+P`) and select **Markdown Preview with mmarked**.
3. Make edits to your Markdown file, and see changes reflected in real-time.

### Configuration Options

You can customize extenstion's feature using the following options in your `.vscode/settings.json`:

```json
{
  "mmarked": {
    "cssUrl": "https://cdn2.mathcrowd.cn/assets/styles/mathcrowd.css",
    "darkCssUrl": "https://cdn2.mathcrowd.cn/assets/styles/mathcrowd-dark.css",
    "enableTex2svg": true
  }
}
```

## 👥 About Mathcrowd

Mathcrowd is an innovative startup founded by experienced independent developers and mathematics educators. We're on a mission to revolutionize math education in China through cutting-edge technology. Our goal is to create an engaging online community for math enthusiasts and self-learners, offering rich, interactive, and visualized learning content.

🌐 MCLab Official Website: [https://lab.mathcrowd.cn](https://lab.mathcrowd.cn)

🌐 Our Online Math Community: [https://www.mathcrowd.cn](https://www.mathcrowd.cn)

💬 Join Our Discord: https://discord.gg/6VMUVA5Yq2

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for more details.

## 📞 Support

For any questions or issues regarding the MMarked extension, please [open an issue](https://github.com/mathedu4all/mmarked-vscode-extension/issues) on our GitHub repository. 

For inquiries specifically related to the @mathcrowd/mmarked library itself, please [open an issue](https://github.com/mathedu4all/mmarked/issues) on its dedicated GitHub repository.