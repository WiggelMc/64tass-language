import { commands, env, window } from "vscode";
import { TaskCommandType } from "../common/capabilities/task";
import { sendTaskCommandFetchRequest } from "../server/task";
import { errorUtil } from "../util/error";
import { ClientHandler } from "../handler";
import { createTaskCommandFetchParams } from "../util/execute";
import { positionUtil } from "../util/position";

export const commandHandler: ClientHandler = {
	register(context) {
		return [
			commands.registerCommand("64tass.copyAssembleCommand", copyAssembleCommand),
			commands.registerCommand("64tass.copyAssembleTask", copyAssembleTask),
		];
	},
};

async function copyAssembleTask() {

	positionUtil.getCurrentDocumentLocation()
		.then(x => createTaskCommandFetchParams(x, TaskCommandType.processTask))

		.then(sendTaskCommandFetchRequest)
		.then(r => env.clipboard.writeText(r.command))
		.then(() => window.showInformationMessage("Assemble Task copied to clipboard"))

		.catch(errorUtil.displayErrorMessage);
}

async function copyAssembleCommand() {

	positionUtil.getCurrentDocumentLocation()
		.then(x => createTaskCommandFetchParams(x, TaskCommandType.commandLineCommand))

		.then(sendTaskCommandFetchRequest)
		.then(r => env.clipboard.writeText(r.command))
		.then(() => window.showInformationMessage("Assemble Command copied to clipboard"))

		.catch(errorUtil.displayErrorMessage);
}