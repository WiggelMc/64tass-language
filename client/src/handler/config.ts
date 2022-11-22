import { ConfigurationChangeEvent, Disposable, Event, ExtensionContext, workspace as VSworkspace } from "vscode";
import { TASKS_CONFIG_CATEGORY, taskUtil } from "../util/task";
import { ClientHandler } from "../handler";
import { configUtil, ConfigUtil, TASS_CONFIG_CATEGORY } from "../util/config";
import { TaskMapUtil, taskMapUtil } from "../util/task-map";

interface WorkspaceAccessor {
	onDidChangeConfiguration: Event<ConfigurationChangeEvent>
}

class ConfigHandler implements ClientHandler {

	private workspace: WorkspaceAccessor;
	private config: ConfigUtil;
	private taskMap: TaskMapUtil;

	constructor(workspace: WorkspaceAccessor, config: ConfigUtil, task: TaskMapUtil) {
		this.workspace = workspace;
		this.config = config;
		this.taskMap = task;
	}

	register(context: ExtensionContext): Disposable[] {
		return [
			this.workspace.onDidChangeConfiguration(this.onDidChangeConfiguration),
		];
	}

	async onDidChangeConfiguration(e: ConfigurationChangeEvent) {

		if (e.affectsConfiguration(TASKS_CONFIG_CATEGORY)) {
			this.taskMap.invalidateTasks();
		}

		if (e.affectsConfiguration(TASS_CONFIG_CATEGORY)) {
			this.config.invalidateConfig();
		}
	};
}

export const configHandler = new ConfigHandler(VSworkspace, configUtil, taskMapUtil);