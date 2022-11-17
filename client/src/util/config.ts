import { workspace } from "vscode";

let config = workspace.getConfiguration("64tass-language");

export enum ConfigSection {
	assembleGotoError = "assemble.goto-error",
	assembleErrorWaitTime = "assemble.error-wait-time"
}

export function getConfigOption<T>(section: ConfigSection): T | undefined {
	return config.get(section);
}

export function invalidateConfig() {
	config = workspace.getConfiguration("64tass-language");
}