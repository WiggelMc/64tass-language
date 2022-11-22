import { window as VSwindow } from "vscode";

interface WindowAccessor {
	showErrorMessage<T extends string>(message: string, ...items: T[]): Thenable<T | undefined>
}

export class ErrorUtil {
	private window: WindowAccessor;


	constructor(window: WindowAccessor) {
		this.window = window;
	}

	async displayErrorMessage(error?: any) {

		const errorMessage = getErrorMessage(error);
		this.window.showErrorMessage(errorMessage);
	}
}

export const errorUtil = new ErrorUtil(VSwindow);

function getErrorMessage(error?: any): string {
	
	if (error instanceof Error) {
		return error.message;
	} else if (typeof error === "string") {
		return error;
	} else {
		return "An unknown Error occurred";
	}
}