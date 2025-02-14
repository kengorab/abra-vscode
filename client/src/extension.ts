import * as path from 'path';
import { ExtensionContext, workspace } from 'vscode';
import { LanguageClient, TransportKind } from 'vscode-languageclient/node';

let client: LanguageClient;

export function activate(context: ExtensionContext) {
  // TODO: uncomment when LSP supports `shutdown` message
  // workspace.onDidChangeConfiguration(() => {
  //   client?.stop();
  //   client = init(context);
  //   client.start();
  // });

  client = init(context);
	client.start();
}

export function deactivate() {
  if (!client) return;
	return client.stop();
}

function init(context: ExtensionContext) {
  const command = getLspCommand(context);

	return new LanguageClient(
		'abra-language-server',
		'Abra Language Server',
		{
      command,
      transport: TransportKind.stdio,
    },
		{
      documentSelector: [
        { scheme: 'file', language: 'abra' }
      ]
    }
	);
}

function getLspCommand(context: ExtensionContext): string {
  // const config = workspace.getConfiguration('abra');

  // if (config.has('lspPath') && config.get('lspPath')) {
  //   return config.get('lspPath');
  // } else {
  //   return context.asAbsolutePath(path.join('bin', 'abra-lsp'));
  // }

  // TODO: don't hardcode
  return '/Users/kengorab/Desktop/abra-lang/projects/lsp/._abra/abra-lsp'
}
