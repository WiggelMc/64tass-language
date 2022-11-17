import { ConfigurationChangeEvent, workspace } from "vscode";
import { invalidateTasks } from "../util/task";
import { invalidateConfig } from "../util/config";
import { ClientHandler } from "./handler";

export const configHandler: ClientHandler = {
	register(context) {
		return [
			workspace.onDidChangeConfiguration(onDidChangeConfiguration),
		];
	},
};

const onDidChangeConfiguration: (e: ConfigurationChangeEvent) => any =
	async function (e) {

		if (e.affectsConfiguration("tasks")) {
			invalidateTasks();
		}

		if (e.affectsConfiguration("64tass-language")) {
			invalidateConfig();
		}
	};