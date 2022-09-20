import { window } from "vscode";


export async function displayErrorMessage(error?: Error) {
	switch (error?.message) {
		case "Task not Found":
			window.showErrorMessage(`Could not find Task`);
			break;
		case "Source File not Found":
			window.showErrorMessage("Could not find Source File");
			break;
		case "List File not Found":
			window.showErrorMessage("Could not find List File");
			break;
		case "Invalid Task Argument":
			window.showErrorMessage("Argument for Custom Task is not valid");
			break;
		case "No Open Editor":
			window.showErrorMessage("No Open Editor");
			break;
		case "Task not defined":
			window.showErrorMessage("The requested Task is not defined for the current Directory");
			break;
		default:
			if (error?.message.startsWith("cannot open")) {
				window.showErrorMessage("Could not open File");
			} else {
				window.showErrorMessage(`Error while running Command: ${error?.message}`);
			}
	}
}