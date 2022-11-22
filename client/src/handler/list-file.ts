import { commands } from "vscode";
import { DocumentLocation } from "../common/capabilities/list-file";
import { TaskType } from "../common/capabilities/task";
import { taskMapUtil, taskUtil } from "../util/task";
import { sendTaskFetchRequest } from "../server/task";
import { sendViewInListFileRequest, sendViewInSourceFileRequest } from "../server/list-file";
import { getCurrentDocumentLocation, gotoDocumentLocation, gotoDocumentLocationStoppable } from "../util/document-location";
import { errorUtil } from "../util/error";
import { ClientHandler } from "../handler";
import { createTaskFetchParams } from "../util/execute";
import { ConfigSection, configUtil } from "../util/config";

export const listFileHandler: ClientHandler = {
	register(context) {
		return [
			commands.registerCommand("64tass.viewInSource", viewInSource),
			commands.registerCommand("64tass.viewInList", viewInList),
			commands.registerCommand("64tass.assembleAndViewInList", assembleAndViewInList),
		];
	},
};

async function viewInSource() {

	getCurrentDocumentLocation()
		.then(sendViewInSourceFileRequest)
		.then(gotoDocumentLocation)

		.catch(errorUtil.displayErrorMessage);
}

async function viewInList() {

	getCurrentDocumentLocation()
		.then(sendViewInListFileRequest)
		.then(gotoDocumentLocation)

		.catch(errorUtil.displayErrorMessage);
}

async function assembleAndViewInList() {

	const waitTime: number = configUtil.getConfigOption(ConfigSection.assembleGotoError)
		? (configUtil.getConfigOption(ConfigSection.assembleErrorWaitTime) ?? 300) : 0;

	let location: DocumentLocation;

	getCurrentDocumentLocation()
		.then(x => location = x)

		.then(x => createTaskFetchParams(x, TaskType.assemble))
		.then(sendTaskFetchRequest)
		.then(r => taskMapUtil.getTask(r.task))
		.then(taskUtil.runTask)

		.then(() => sendViewInListFileRequest(location))
		.then(l => gotoDocumentLocationStoppable(l, waitTime))

		.catch(errorUtil.displayErrorMessage);
}