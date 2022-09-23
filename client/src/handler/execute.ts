import { commands, env, window } from "vscode";
import { DocumentLocation } from "../common/capabilities/list-file";
import { TaskFetchParams, TaskType } from "../common/capabilities/task";
import { runTask, TaskMap } from "../util/task";
import { sendTaskFetchRequest } from "../server/task";
import { sendViewInListFileRequest, sendViewInSourceFileRequest } from "../server/list-file";
import { getCurrentDocumentLocation, gotoDocumentLocation, gotoDocumentLocationStoppable } from "../util/document-location";
import { displayErrorMessage } from "../util/error";
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

            commands.registerCommand("64tass.copyAssembleCommand", copyAssembleCommand),
            commands.registerCommand("64tass.copyAssembleTask", copyAssembleTask),
        ];
    },
};

async function viewInSource() {
		
	getCurrentDocumentLocation()
	.then(sendViewInSourceFileRequest)
	.then(gotoDocumentLocation)
	
	.catch(displayErrorMessage);
}

async function viewInList() {

	getCurrentDocumentLocation()
	.then(sendViewInListFileRequest)
	.then(gotoDocumentLocation)
	
	.catch(displayErrorMessage);
}

async function assembleAndViewInList() {

	let location: DocumentLocation;

	getCurrentDocumentLocation()
	.then(x => location = x)
	
	.then(createTaskFetchParamConverter(TaskType.assemble))
	.then(sendTaskFetchRequest)
	.then(r => TaskMap.getTask(r.task))
	.then(runTask)

	.then(() => sendViewInListFileRequest(location))
	.then(gotoDocumentLocationStoppable)

	.catch(displayErrorMessage);
}

async function executeTaskType(type: TaskType) {

	getCurrentDocumentLocation()
	.then(createTaskFetchParamConverter(type))

	.then(sendTaskFetchRequest)
	.then(r => TaskMap.getTask(r.task))
	.then(runTask)
	
	.catch(displayErrorMessage);
}

const createTaskFetchParamConverter: (type: TaskType) => ((location: DocumentLocation) => Promise<TaskFetchParams>) =
function(type: TaskType) {
	return async function(location: DocumentLocation) {

		return {
			textDocument: location.textDocument,
			taskType: type
		};
	};
};

const runCustomTask: (...args: any[]) => Promise<void> =
async function(taskString) {
	if (taskString === undefined) {
		showCustomTaskInputBox()
		.then(executeCustomTaskType)
		.catch(displayErrorMessage);
	} else {
		executeCustomTaskType(taskString)
		.catch(displayErrorMessage);
	}
};

async function showCustomTaskInputBox() {

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
}

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

async function copyAssembleTask() {

	getCurrentDocumentLocation()
	
	.then(() => "Assemble Task")
	.then(env.clipboard.writeText)
	.then(() => window.showInformationMessage("Assemble Task copied to clipboard"))

	.catch(displayErrorMessage);
}

async function copyAssembleCommand() {
	
	getCurrentDocumentLocation()

	.then(() => "Assemble Command")
	.then(env.clipboard.writeText)
	.then(() => window.showInformationMessage("Assemble Command copied to clipboard"))

	.catch(displayErrorMessage);
}