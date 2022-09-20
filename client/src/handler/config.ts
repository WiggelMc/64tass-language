import { ConfigurationChangeEvent, workspace } from "vscode";
import { TaskMap } from "../tasks";
import { ClientInitHandler } from "./handler";

export const configHandler: ClientInitHandler = {
    register(context) {
        return [
            workspace.onDidChangeConfiguration(onDidChangeConfiguration),
        ];
    },
};

export let config = workspace.getConfiguration("64tass-language");

const onDidChangeConfiguration: (e: ConfigurationChangeEvent) => any =
async function(e) {

	if (e.affectsConfiguration("tasks")) {
		TaskMap.invalidate();
	}

	if (e.affectsConfiguration("64tass-language")) {
		config = workspace.getConfiguration("64tass-language");
	}
};