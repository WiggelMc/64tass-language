import { _Connection, _, DidChangeConfigurationParams, NotificationHandler } from "vscode-languageserver";
import { config, documentSettings, DocumentSettings, defaultSettings } from "../data/data";
import { ConnectionEventHandler } from "./handler";

export const configurationHandler : ConnectionEventHandler = {
    register: function (connection: _Connection<_, _, _, _, _, _, _>): void {
        
        connection.onDidChangeConfiguration(onDidChangeConfiguration);
    },
    capabilities: {

    }
};

const onDidChangeConfiguration: NotificationHandler<DidChangeConfigurationParams> = 
async function(params) {

    if (config.hasConfigurationCapability) {
		// Reset all cached document settings
		documentSettings.clear();
	} else {
		config.globalSettings = <DocumentSettings>(
			(params.settings.languageServerExample || defaultSettings)
		);
	}

    // Revalidate all open text documents
	// documents.all().forEach(validateTextDocument); //TODO: fix
};