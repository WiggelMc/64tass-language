import { commands, window } from "vscode";
import { DocumentLocation } from "../common/capabilities/list-file";
import { TaskFetchParams, TaskType } from "../common/capabilities/task";
import { client } from "../extension";
import { runTask, sendTaskFetchRequest, TaskMap } from "../tasks";
import { getCurrentDocumentLocation, gotoDocumentLocation, gotoDocumentLocationStoppable, sendViewInListFileRequest, sendViewInSourceFileRequest } from "../util/list-file-utils";
import { displayErrorMessage } from "./error";
import { ClientHandler } from "./handler";

export const executeHandler: ClientHandler = {
    register(context) {
        return [
            commands.registerCommand("64tass.viewInSource", viewInSource),
            commands.registerCommand("64tass.viewInList", viewInList),
            commands.registerCommand("64tass.assembleAndViewInList", assembleAndViewInList),

            commands.registerCommand("64tass.runCustomTask", runCustomTask),

            commands.registerCommand("64tass.assemble", () => executeTaskType(TaskType.assemble)),
            commands.registerCommand("64tass.assembleAndStart", () => executeTaskType(TaskType.assembleAndStart)),
            commands.registerCommand("64tass.start", () => executeTaskType(TaskType.start)),
        ];
    },
};

async function viewInSource() {
		
	let location: DocumentLocation;
	try {
		location = getCurrentDocumentLocation();
	} catch (error) {
		window.showErrorMessage("No Open Editor");
		return;
	}

	sendViewInSourceFileRequest(client, location)
	.then(gotoDocumentLocation)
	.catch(displayErrorMessage);
}

async function viewInList() {

	let location: DocumentLocation;
	try {
		location = getCurrentDocumentLocation();
	} catch (error) {
		window.showErrorMessage("No Open Editor");
		return;
	}

	sendViewInListFileRequest(client, location)
	.then(gotoDocumentLocation)
	.catch(displayErrorMessage);
}

async function assembleAndViewInList() {

	let location: DocumentLocation;
	try {
		location = getCurrentDocumentLocation();
	} catch (error) {
		window.showErrorMessage("No Open Editor");
		return;
	}
	
	const params: TaskFetchParams = {
		textDocument: location.textDocument,
		taskType: TaskType.assemble
	};

	sendTaskFetchRequest(client, params)
	.then(r => TaskMap.getTask(r.task))
	.then(runTask)
	.then(() => sendViewInListFileRequest(client, location))
	.then(gotoDocumentLocationStoppable)
	.catch(displayErrorMessage);
}

async function executeTaskType(type: TaskType) {

	let location: DocumentLocation;
	try {
		location = getCurrentDocumentLocation();
	} catch (error) {
		window.showErrorMessage("No Open Editor");
		return;
	}
	
	const params: TaskFetchParams = {
		textDocument: location.textDocument,
		taskType: type
	};

	sendTaskFetchRequest(client, params)
	.then(r => TaskMap.getTask(r.task))
	.then(runTask)
	.catch(displayErrorMessage);
}

const runCustomTask: (...args: any[]) => Promise<void> =
async function(taskString) {
	if (taskString === undefined) {
		(async () => {})()
		.then(() => {
			return window.showInputBox({
				prompt: "Enter Task Number",
				validateInput(taskString) {
					if (validateCustomTaskInput(taskString)) {
						return "";
					} else {
						return "Input must be a positive integer";
					}
				}
			});
		})
		.then(executeCustomTaskType)
		.catch(displayErrorMessage);
	} else {
		executeCustomTaskType(taskString)
		.catch(displayErrorMessage);
	}
};

async function executeCustomTaskType(taskString?: string) {

	if (taskString === undefined) {
		return;
	}

	if (!validateCustomTaskInput(taskString)) {
		throw new Error("Invalid Task Argument");
	}

	const taskNumber = Number(taskString);
	executeTaskType(TaskType.customTaskOf(taskNumber));
}

function validateCustomTaskInput(taskString: string) {
	const taskNumber = Number(taskString);
	return (
		!isNaN(taskNumber) 
		&& taskNumber >= 1 
		&& taskNumber <= 1000
		&& Number.isInteger(taskNumber)
	);
}