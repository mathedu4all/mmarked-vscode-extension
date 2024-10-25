import * as vscode from 'vscode';
import { renderMarkdown } from '@mathcrowd/mmarked';
import path from 'path';

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
                const content = editor.document.getText();
                panel.webview.html = getWebviewContent(content,context, panel);
            }

            // Update content when text changes
            vscode.workspace.onDidChangeTextDocument((event) => {
                if (event.document === editor?.document) {
                    const content = event.document.getText();
                    panel.webview.html = getWebviewContent(content,context,panel);
                }
            });
        })
    );
}

function getWebviewContent(content: string, context:vscode.ExtensionContext, panel:vscode.WebviewPanel ): string {
    let parsed;
    try {
        const result = renderMarkdown(content);
        parsed = result.parsed;
    } catch (error) {
        parsed = `<p>Error rendering Markdown: ${error.message}</p>`;
    }
	const myStyle = panel.webview.asWebviewUri(vscode.Uri.joinPath(
        context.extensionUri, 'src','media', 'mathcrowd.css'));

    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
			<link rel="stylesheet" type="text/css" href="${myStyle}">
            <title>Markdown Preview</title>
        </head>
        <body>
			<section class="mmarked article-mmarked">
				${parsed}
			</section>
        </body>
        </html>
    `;
}

export function deactivate() {}
