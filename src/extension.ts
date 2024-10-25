import * as vscode from 'vscode';
import { renderMarkdown } from '@mathcrowd/mmarked';

class MarkdownPreviewPanel {
    private static readonly viewType = 'mmarkedPreview';
    private static readonly defaultCssUrl = 'https://cdn2.mathcrowd.cn/assets/styles/mathcrowd.css';

    private readonly panel: vscode.WebviewPanel;
    private readonly disposables: vscode.Disposable[] = [];

    private constructor() {
        this.panel = vscode.window.createWebviewPanel(
            MarkdownPreviewPanel.viewType,
            'Markdown Preview with mmarked',
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

        // 清理资源
        this.panel.onDidDispose(() => this.dispose(), null, this.disposables);
    }

    private updateContent(): void {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            this.showError('No active text editor found.');
            return;
        }

        try {
            const content = editor.document.getText();
            const { parsed } = renderMarkdown(content);
            this.panel.webview.html = this.generateHtml(parsed);
        } catch (error) {
            this.showError(error instanceof Error ? error.message : 'Unknown error occurred');
        }
    }

    private generateHtml(parsedContent: string): string {
        const cssUri = MarkdownPreviewPanel.defaultCssUrl;
        const cssHost = new URL(cssUri).origin;

        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${cssHost}">
                <title>Markdown Preview</title>
                <link href="${cssUri}" rel="stylesheet" />
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
        this.panel.webview.html = `
            <div style="color: red; padding: 20px;">
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
        this.disposables.forEach(d => d.dispose());
    }
}

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('mmarked.previewMarkdown', () => {
        MarkdownPreviewPanel.create();
    });
    context.subscriptions.push(disposable);
}

export function deactivate() {}