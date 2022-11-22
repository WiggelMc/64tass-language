import { commands } from "vscode";
import { DocumentLocation } from "../common/capabilities/list-file";
import { TaskType } from "../common/capabilities/task";
import { taskUtil } from "../util/task";
import { sendTaskFetchRequest } from "../server/task";
import { sendViewInListFileRequest, sendViewInSourceFileRequest } from "../server/list-file";
import { errorUtil } from "../util/error";
import { ClientHandler } from "../handler";
import { createTaskFetchParams } from "../util/execute";
import { ConfigSection, configUtil } from "../util/config";
import { taskMapUtil } from "../util/task-map";
import { gotoUtil } from "../util/goto";
import { currentDocumentLocationUtil } from "../util/current-document-location";

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

	currentDocumentLocationUtil.getCurrentDocumentLocation()
		.then(sendViewInSourceFileRequest)
		.then(gotoUtil.gotoDocumentLocation)

		.catch(errorUtil.displayErrorMessage);
}

async function viewInList() {

	currentDocumentLocationUtil.getCurrentDocumentLocation()
		.then(sendViewInListFileRequest)
		.then(gotoUtil.gotoDocumentLocation)

		.catch(errorUtil.displayErrorMessage);
}

async function assembleAndViewInList() {

	const waitTime: number = configUtil.getConfigOption(ConfigSection.assembleGotoError)
		? (configUtil.getConfigOption(ConfigSection.assembleErrorWaitTime) ?? 300) : 0;

	let location: DocumentLocation;

	currentDocumentLocationUtil.getCurrentDocumentLocation()
		.then(x => location = x)

		.then(x => createTaskFetchParams(x, TaskType.assemble))
		.then(sendTaskFetchRequest)
		.then(r => taskMapUtil.getTask(r.task))
		.then(taskUtil.runTask)

		.then(() => sendViewInListFileRequest(location))
		.then(l => gotoUtil.gotoDocumentLocationStoppable(l, waitTime))

		.catch(errorUtil.displayErrorMessage);
}