import { ConfigurationChangeEvent, workspace } from "vscode";
import { invalidateTasks } from "../util/task";
import { ClientHandler } from "./handler";

export const configHandler: ClientHandler = {
	register(context) {
		return [
			workspace.onDidChangeConfiguration(onDidChangeConfiguration),
		];
	},
};

let config = workspace.getConfiguration("64tass-language");

export enum ConfigSection {
	assembleGotoError = "assemble.goto-error",
	assembleErrorWaitTime = "assemble.error-wait-time",
}

export function getConfigOption<T>(section: ConfigSection): T | undefined {
	return config.get(section);
}

const onDidChangeConfiguration: (e: ConfigurationChangeEvent) => any =
	async function (e) {

		if (e.affectsConfiguration("tasks")) {
			invalidateTasks();
		}

		if (e.affectsConfiguration("64tass-language")) {
			config = workspace.getConfiguration("64tass-language");
		}
	};