// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { FindPanel } from './FindView';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) { 

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "forage" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('forage.find', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		FindPanel.createOrShow(context.extensionUri);
		FindPanel.post({"command": "beginSearch", "source": vscode.window.activeTextEditor?.document.getText()});
	});
	
	context.subscriptions.push(disposable);

	if (vscode.window.registerWebviewPanelSerializer) {
		// Make sure we register a serializer in activation event
		vscode.window.registerWebviewPanelSerializer(FindPanel.viewType, {
			async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel, state: any) {
				console.log(`Got state: ${state}`);
				// Reset the webview options so we use latest uri for `localResourceRoots`.
				webviewPanel.webview.options = {
					enableScripts: true,
					localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'media')]
				};
				FindPanel.revive(webviewPanel, context.extensionUri);
			}
		});
	}
}

// this method is called when your extension is deactivated
export function deactivate() { }