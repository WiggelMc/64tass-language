import { ConfigurationScope, workspace as VSworkspace, WorkspaceConfiguration } from "vscode";

export const TASS_CONFIG_CATEGORY = "64tass-language";

export enum ConfigSection {
	assembleGotoError = "assemble.goto-error",
	assembleErrorWaitTime = "assemble.error-wait-time"
}

interface WorkspaceAccessor {
	getConfiguration(section?: string, scope?: ConfigurationScope | null): WorkspaceConfiguration
}

export class ConfigUtil {
	workspace: WorkspaceAccessor;

	config: WorkspaceConfiguration;

	constructor(workspace: WorkspaceAccessor) {
		this.workspace = workspace;

		this.invalidateConfig();
	}

	invalidateConfig() {
		this.config = this.workspace.getConfiguration(TASS_CONFIG_CATEGORY);
	}

	getConfigOption<T>(section: ConfigSection): T | undefined {
		return this.config.get(section);
	}
}

export const configUtil = new ConfigUtil(VSworkspace);