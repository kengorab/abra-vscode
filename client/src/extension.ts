import * as path from 'path';
import { ExtensionContext } from 'vscode';
import { LanguageClient, TransportKind } from 'vscode-languageclient';

let client: LanguageClient;

export function activate(context: ExtensionContext) {
	const serverModule = context.asAbsolutePath(
		path.join('server', 'out', 'server.js')
	);
	const serverOptions = { module: serverModule, transport: TransportKind.ipc };
	const clientOptions = { documentSelector: [{ scheme: 'file', language: 'abra' }] };

	client = new LanguageClient(
		'abra-language-server',
		'Abra Language Server',
		serverOptions,
		clientOptions
	);
	client.start();
}

export function deactivate() {
  if (!client) return
	return client.stop()
}