import { workspace, WorkspaceConfiguration } from "vscode";

export const TASS_CONFIG_CATEGORY = "64tass-language";

let config: WorkspaceConfiguration;
invalidateConfig();

export enum ConfigSection {
	assembleGotoError = "assemble.goto-error",
	assembleErrorWaitTime = "assemble.error-wait-time"
}

export function getConfigOption<T>(section: ConfigSection): T | undefined {
	return config.get(section);
}

export function invalidateConfig() {
	config = workspace.getConfiguration(TASS_CONFIG_CATEGORY);
}