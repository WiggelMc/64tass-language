import { ConfigurationChangeEvent, workspace } from "vscode";
import { invalidateTasks, TASKS_CONFIG_CATEGORY } from "../util/task";
import { invalidateConfig, TASS_CONFIG_CATEGORY } from "../util/config";
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

		if (e.affectsConfiguration(TASKS_CONFIG_CATEGORY)) {
			invalidateTasks();
		}

		if (e.affectsConfiguration(TASS_CONFIG_CATEGORY)) {
			invalidateConfig();
		}
	};