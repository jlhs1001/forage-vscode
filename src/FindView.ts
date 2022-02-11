import * as vscode from 'vscode';

export class FindPanel {
    /**
     * Track the current panel. Only allow a single panel to exist at a time/
     */
    public static currentPanel: FindPanel | undefined;
    public static viewType = 'find';

    private readonly _panel: vscode.WebviewPanel;
    private readonly _extensionUri: vscode.Uri;
    private _disposables: vscode.Disposable[] = [];

    public static createOrShow(extensionUri: vscode.Uri) {
        // Show panel if it already exists
        if (FindPanel.currentPanel) {
            FindPanel.currentPanel._panel.reveal(vscode.ViewColumn.Beside);
            return;
        }

        // Else, create a new panel.
        const panel: vscode.WebviewPanel = vscode.window.createWebviewPanel(
            FindPanel.viewType,
            "Find",
            vscode.ViewColumn.Beside,
            {
                enableScripts: true,
                localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'media')]
            }
        );

        FindPanel.currentPanel = new FindPanel(panel, extensionUri);
    }

    public static revive(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        FindPanel.currentPanel = new FindPanel(panel, extensionUri);
    }

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        this._panel = panel;
        this._extensionUri = extensionUri;

        // Set webview's initial html
        this._update();

        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

        this._panel.onDidChangeViewState(e => {
            if (this._panel.visible) {
                this._update();
            }
        },
            null,
            this._disposables
        );

        this._panel.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'alert':
                        vscode.window.showErrorMessage(message.text);
                        return;
                }
            },
            null,
            this._disposables
        );
    }

    public dispose() {
        FindPanel.currentPanel = undefined;

        // clean up resources
        this._panel.dispose();

        while (this._disposables.length) {
            this._disposables.pop()?.dispose();
        }
    }

    private _update() {
        const webview = this._panel.webview;
        this._panel.webview.html = this._getHtmlForWebview(webview);
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        const script: vscode.Uri = vscode.Uri.joinPath(this._extensionUri, 'media', 'index.js');
        const scriptUri: vscode.Uri = (script).with({ 'scheme': 'vscode-resource' });

        const style: vscode.Uri = vscode.Uri.joinPath(this._extensionUri, 'media', 'index.css');
        const styleUri: vscode.Uri = webview.asWebviewUri(style);

        const nonce = this.getNonce();
        
		return `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <!--
                Use a content security policy to only allow loading images from https or from our extension directory,
                and only allow scripts that have a specific nonce.
            -->
            <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; img-src ${webview.cspSource} https:; script-src 'nonce-${nonce}';">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link href="${styleUri}" rel="stylesheet">
            <title>Cat Coding</title>
        </head>
        <body>
            <div id="content">
                <div class="hidden">
                    <div class="queryTemplate">
                        <input type="text" class="queries">
                        <div class="queryButton">+</div>
                        <div class="queryButton">-</div>
                        <div class="querySelect">
                            <div class="queryOption">&</div>
                            <div class="queryOption">|</div>
                        </div>
                    </div>
                </div>
                <div id="queryContainer">

                </div>
                <pre>
                    <div id="queryResult"></div>
                </pre>
            </div>
            <script nonce="${nonce}" src="${scriptUri}"></script>
        </body>
        </html>`;
    }

    private getNonce() {
        let text: string = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 32; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }

    public static post(message: any) {
        FindPanel.currentPanel?._panel.webview.postMessage(message);
    }
}