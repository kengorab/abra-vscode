import * as path from 'path';
import { ExtensionContext, workspace } from 'vscode';
import { LanguageClient } from 'vscode-languageclient';

let client: LanguageClient;

export function activate(context: ExtensionContext) {
  workspace.onDidChangeConfiguration(() => {
    console.log('config changed!');
    
    client?.stop();
    client = init(context);
    client.start();
  });

  client = init(context);
	client.start();
}

export function deactivate() {
  if (!client) return;
	return client.stop();
}

function init(context: ExtensionContext) {
  const command = getLspCommand(context);
  const serverOptions = { command };
	const clientOptions = { documentSelector: [{ scheme: 'file', language: 'abra' }] };

	return new LanguageClient(
		'abra-language-server',
		'Abra Language Server',
		serverOptions,
		clientOptions
	);
}

function getLspCommand(context: ExtensionContext): string {
  const config = workspace.getConfiguration('abra');

  if (config.has('lspPath') && config.get('lspPath')) {
    return config.get('lspPath');
  } else {
    return context.asAbsolutePath(path.join('bin', 'abra-lsp'));
  }
}
