import { ConfigurationChangeEvent, Disposable, Event, ExtensionContext, workspace as VSworkspace } from "vscode";
import { TASKS_CONFIG_CATEGORY } from "../util/task";
import { ClientHandler } from "../handler";
import { configUtil, ConfigUtil, TASS_CONFIG_CATEGORY } from "../util/config";
import * as task from "../util/task";

interface TaskUtil { //Class TaskUtil will be used later
	invalidateTasks: () => void
}

interface WorkspaceAccessor {
	onDidChangeConfiguration: Event<ConfigurationChangeEvent>
}

class ConfigHandler implements ClientHandler {

	workspace: WorkspaceAccessor;
	config: ConfigUtil;
	task: TaskUtil;

	constructor(workspace: WorkspaceAccessor, config: ConfigUtil, task: TaskUtil) {
		this.workspace = workspace;
		this.config = config;
		this.task = task;
	}

	register(context: ExtensionContext): Disposable[] {
		return [
			this.workspace.onDidChangeConfiguration(this.onDidChangeConfiguration),
		];
	}

	async onDidChangeConfiguration(e: ConfigurationChangeEvent) {

		if (e.affectsConfiguration(TASKS_CONFIG_CATEGORY)) {
			this.task.invalidateTasks();
		}

		if (e.affectsConfiguration(TASS_CONFIG_CATEGORY)) {
			this.config.invalidateConfig();
		}
	};
}

export const configHandler = new ConfigHandler(VSworkspace, configUtil, task);