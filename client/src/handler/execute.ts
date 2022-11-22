import { commands, window } from "vscode";
import { TaskType } from "../common/capabilities/task";
import { taskMapUtil, taskUtil } from "../util/task";
import { sendTaskFetchRequest } from "../server/task";
import { getCurrentDocumentLocation } from "../util/document-location";
import { errorUtil } from "../util/error";
import { ClientHandler } from "../handler";
import { createTaskFetchParams } from "../util/execute";

export const executeHandler: ClientHandler = {
	register(context) {
		return [
			commands.registerCommand("64tass.runCustomTask", runCustomTask),

			commands.registerCommand("64tass.assemble", () => executeTaskType(TaskType.assemble)),
			commands.registerCommand("64tass.assembleAndStart", () => executeTaskType(TaskType.assembleAndStart)),
			commands.registerCommand("64tass.start", () => executeTaskType(TaskType.start)),
		];
	},
};

async function executeTaskType(type: TaskType) {

	getCurrentDocumentLocation()
		.then(x => createTaskFetchParams(x, type))

		.then(sendTaskFetchRequest)
		.then(r => taskMapUtil.getTask(r.task))
		.then(taskUtil.runTask)

		.catch(errorUtil.displayErrorMessage);
}

const runCustomTask: (...args: any[]) => Promise<void> =
	async function (taskString) {

		showCustomTaskInputBox(taskString)
			.then(executeCustomTaskType)
			.catch(errorUtil.displayErrorMessage);
	};

async function showCustomTaskInputBox(taskString: string): Promise<string> {

	return taskString ?? window.showInputBox({
		prompt: "Enter Task Number",
		validateInput(taskString) {
			return validateCustomTaskInput(taskString) ? "" : "Input must be a positive integer";
		}
	});
}

async function executeCustomTaskType(taskString?: string) {

	if (taskString === undefined) {
		return;
	}

	if (!validateCustomTaskInput(taskString)) {
		throw new InvalidCustomTaskArgumentError(taskString);
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

export class InvalidCustomTaskArgumentError extends Error {
	constructor(taskString: string) {
		
		super(`The Argument '${taskString}' is not a valid Number for a Custom Task`);
		this.name = "InvalidCustomTaskArgumentError";
	}
}