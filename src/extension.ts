import * as vscode from 'vscode';
import { renderMarkdown } from '@mathcrowd/mmarked';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('mmarked.previewMarkdown', () => {
            const panel = vscode.window.createWebviewPanel(
                'mmarkedPreview',
                'Markdown Preview with mmarked',
                vscode.ViewColumn.Two,
                {
                    enableScripts: true,
                }
            );

            // Get the active editor's content and render it
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                updateWebviewContent(editor.document.getText(), panel);
            }

            // Update content when text changes
            const textChangeListener = vscode.workspace.onDidChangeTextDocument((event) => {
                if (event.document === editor?.document) {
                    updateWebviewContent(event.document.getText(), panel);
                }
            });

            // Clean up the listener on panel dispose
            panel.onDidDispose(() => {
                textChangeListener.dispose();
            });
        })
    );
}

function updateWebviewContent(content: string, panel: vscode.WebviewPanel): void {
    let parsed;
    try {
        const result = renderMarkdown(content);
        parsed = result.parsed;
    } catch (error) {
        parsed = `<p style="color:red;">Error rendering Markdown: ${error.message}</p>`;
    }

    panel.webview.html = getWebviewContent(parsed);
}

function getWebviewContent(parsedContent: string): string {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Markdown Preview</title>
        </head>
        <body>
            <section class="mmarked article-mmarked">
                ${parsedContent}
            </section>
        </body>
        </html>
    `;
}

export function deactivate() {}