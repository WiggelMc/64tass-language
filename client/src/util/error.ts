import { window } from "vscode";

export async function displayErrorMessage(error?: any) {

	const errorMessage = getErrorMessage(error);
	window.showErrorMessage(errorMessage);
}

function getErrorMessage(error?: any): string {
	
	if (error instanceof Error) {
		return error.message;
	} else if (typeof error === "string") {
		return error;
	} else {
		return "An unknown Error occurred";
	}
}