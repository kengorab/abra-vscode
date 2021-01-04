import * as Abra from '@kengorab/abra_wasm';
import {
	createConnection,
	TextDocuments,
	DiagnosticSeverity,
	ProposedFeatures,
	TextDocumentSyncKind,
  Position,
} from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';

const connection = createConnection(ProposedFeatures.all);
const documents = new TextDocuments(TextDocument);

connection.onInitialize(() => {
	return {
		capabilities: {
			textDocumentSync: TextDocumentSyncKind.Incremental,
		}
	};
});

documents.onDidChangeContent(change => {
	validateTextDocument(change.document);
});

function validateTextDocument(doc: TextDocument) {
  const text = doc.getText();
  const result = Abra.typecheck(text);

  const diagnostics = []
  if (result && !result.success && result.error.range) {
    const { start, end } = result.error.range
    const from = Position.create(start[0] - 1, start[1] - 1)
    const to = Position.create(end[0] - 1, end[1])
    const msg = result.errorMessage;

		const diagnostic = {
			severity: DiagnosticSeverity.Error,
			range: { start: from, end: to },
			message: msg
    };
    diagnostics.push(diagnostic)
  }

  connection.sendDiagnostics({ uri: doc.uri, diagnostics });
}

documents.listen(connection);
connection.listen();
