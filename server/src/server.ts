import { createConnection, ProposedFeatures } from 'vscode-languageserver/node';
import { registerHandlers } from './handler/handler';

// Create a connection for the server, using Node's IPC as a transport.
// Also include all preview / proposed LSP features.
export const connection = createConnection(ProposedFeatures.all);

registerHandlers(connection);

// Listen on the connection
connection.listen();