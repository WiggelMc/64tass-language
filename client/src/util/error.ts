import { window } from "vscode";

const errorMap: Map<string, string> = new Map([

	["Task not Found", "Could not find Task"],
	["Source File not Found", "Could not find Source File"],
	["List File not Found", "Could not find List File"],
	["Invalid Task Argument", "Argument for Custom Task is not valid"],
	["No Open Editor", "No Open Editor"],
	["Task not defined", "The requested Task is not defined for the current Directory"],
	["Command could not be created", "The Requested Command could not be created from 64tasslang.json"],
]);

const errorRegex: [RegExp, string][] = [

	[/^cannot open/, "Could not open File"],
];

export async function displayErrorMessage(error?: any) {

	if (error === undefined || !(error instanceof Error)) {
		window.showErrorMessage("An unknown Error occurred");

	} else if (errorMap.has(error.message)) {
		window.showErrorMessage(errorMap.get(error.message));

	} else {
		const m = matchRegex(error.message);

		if (m !== undefined) {
			window.showErrorMessage(m);
		} else {
			window.showErrorMessage(`Error while running Command: ${error.message}`);
		}
	}
}

function matchRegex(message: string): string | undefined {

	for (const [regex, value] of errorRegex) {

		if (regex.test(message)) {
			return value;
		}
	}
	return undefined;
}