import * as vscode from "vscode";
import { renderMarkdown, tex2svg } from "@mathcrowd/mmarked";

class MarkdownPreviewPanel {
  private static readonly viewType = "mmarkedPreview";

  private readonly panel: vscode.WebviewPanel;
  private readonly disposables: vscode.Disposable[] = [];

  private constructor() {
    this.panel = vscode.window.createWebviewPanel(
      MarkdownPreviewPanel.viewType,
      "Markdown Preview with mmarked",
      vscode.ViewColumn.Two,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
      }
    );

    this.initialize();
  }

  public static create(): MarkdownPreviewPanel {
    return new MarkdownPreviewPanel();
  }

  private initialize(): void {
    // 更新初始内容
    this.updateContent();

    // 监听文本变化
    this.disposables.push(
      vscode.workspace.onDidChangeTextDocument(
        this.debounce((event: vscode.TextDocumentChangeEvent) => {
          const activeEditor = vscode.window.activeTextEditor;
          if (event.document === activeEditor?.document) {
            this.updateContent();
          }
        }, 300)
      )
    );

    // 监听主题变化
    this.disposables.push(
      vscode.window.onDidChangeActiveColorTheme(() => {
        this.updateContent();
      })
    );

    // 监听配置变化
    this.disposables.push(
      vscode.workspace.onDidChangeConfiguration((e) => {
        if (
          e.affectsConfiguration("mmarked.cssUrl") ||
          e.affectsConfiguration("mmarked.darkCssUrl") ||
          e.affectsConfiguration("mmarked.enableTex2svg")
        ) {
          this.updateContent();
        }
      })
    );

    // 清理资源
    this.panel.onDidDispose(() => this.dispose(), null, this.disposables);
  }

  private getCurrentTheme(): "light" | "dark" {
    const currentTheme = vscode.window.activeColorTheme;
    return currentTheme.kind === vscode.ColorThemeKind.Light ? "light" : "dark";
  }

  private getCurrentCssUrl(): string {
    const config = vscode.workspace.getConfiguration("mmarked");
    const theme = this.getCurrentTheme();

    // 读取配置中的自定义 CSS URL
    const cssUrl = config.get<string>("cssUrl");
    const darkCssUrl = config.get<string>("darkCssUrl");

    // 使用用户定义的 CSS URL 或默认值
    return theme === "light"
      ? cssUrl || "https://cdn2.mathcrowd.cn/assets/styles/mathcrowd.css"
      : darkCssUrl || "https://cdn2.mathcrowd.cn/assets/styles/mathcrowd-dark.css";
  }

  private updateContent(): void {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      this.showError("No active text editor found.");
      return;
    }

    try {
      const content = editor.document.getText();
      const config = vscode.workspace.getConfiguration("mmarked");
      const { parsed } = renderMarkdown(content);

      this.panel.webview.html = this.generateHtml(
        (config.get<boolean>("enableTex2svg") ?? false) ? tex2svg(parsed) : parsed
      );
    } catch (error) {
      this.showError(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    }
  }

  private generateHtml(parsedContent: string): string {
    const cssUri = this.getCurrentCssUrl();
    const cssHost = new URL(cssUri).origin;
    const theme = this.getCurrentTheme();

    return `
      <!DOCTYPE html>
      <html lang="en" data-theme="${theme}">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="Content-Security-Policy" content="default-src *; style-src *;">
          <title>Markdown Preview</title>
          <link href="${cssUri}" rel="stylesheet" />
          <style>
              body {
                  background-color: ${
                    theme === "light" ? "#ffffff" : "#1e1e1e"
                  };
                  color: ${theme === "light" ? "#000000" : "#ffffff"};
              }
          </style>
      </head>
      <body>
          <section class="mmarked article-mmarked">
              ${parsedContent}
          </section>
      </body>
      </html>
    `;
  }

  private showError(message: string): void {
    const theme = this.getCurrentTheme();
    this.panel.webview.html = `
      <div style="
          color: ${theme === "light" ? "#ff0000" : "#ff6b6b"}; 
          padding: 20px;
          background-color: ${theme === "light" ? "#ffffff" : "#1e1e1e"};
      ">
          <h3>Error</h3>
          <p>${message}</p>
      </div>
    `;
    vscode.window.showErrorMessage(`Markdown Preview Error: ${message}`);
  }

  private debounce<T extends (...args: any[]) => any>(
    fn: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  }

  private dispose(): void {
    this.disposables.forEach((d) => d.dispose());
  }
}

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "mmarked.previewMarkdown",
    () => {
      MarkdownPreviewPanel.create();
    }
  );
  context.subscriptions.push(disposable);
}

export function deactivate() {}
