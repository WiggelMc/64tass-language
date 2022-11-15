import { ConfigurationChangeEvent, workspace } from "vscode";
import { TaskMap } from "../util/task";
import { ClientHandler } from "./handler";

export const configHandler: ClientHandler = {
	register(context) {
		return [
			workspace.onDidChangeConfiguration(onDidChangeConfiguration),
		];
	},
};

let config = workspace.getConfiguration("64tass-language");

export function getConfigOption<T>(section: string): T | undefined {
	return config.get(section);
}

const onDidChangeConfiguration: (e: ConfigurationChangeEvent) => any =
	async function (e) {

		if (e.affectsConfiguration("tasks")) {
			TaskMap.invalidate();
		}

		if (e.affectsConfiguration("64tass-language")) {
			config = workspace.getConfiguration("64tass-language");
		}
	};