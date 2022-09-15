import { _Connection, _, DidChangeConfigurationParams, NotificationHandler } from "vscode-languageserver";
import { globalCapabilities, documentSettings, ExtensionSettings, defaultSettings, globalDocumentSettings } from "../data/data";
import { ConnectionEventHandler } from "./handler";

export const configurationHandler : ConnectionEventHandler = {
    register: function (connection: _Connection<_, _, _, _, _, _, _>): void {
        
        connection.onDidChangeConfiguration(onDidChangeConfiguration);
    }
};

export const onDidChangeConfiguration: NotificationHandler<DidChangeConfigurationParams> = 
async function(params) {

	console.log("VSCode Config Change: ", params);

    if (globalCapabilities.hasConfigurationCapability) {
		// Reset all cached document settings
		documentSettings.clear();
	} else {
		globalDocumentSettings.settings = <ExtensionSettings>(
			(params.settings.languageServerExample || defaultSettings)
		);
	}

    // Revalidate all open text documents
	// documents.all().forEach(validateTextDocument); //TODO: fix
};