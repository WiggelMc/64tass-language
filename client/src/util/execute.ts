import { DocumentLocation } from "../common/capabilities/list-file";
import { TaskCommandFetchParams, TaskCommandType, TaskFetchParams, TaskType } from "../common/capabilities/task";

export const createTaskFetchParamConverter: (type: TaskType) => ((location: DocumentLocation) => Promise<TaskFetchParams>) =
function(type: TaskType) {
	return async function(location: DocumentLocation) {

		return {
			textDocument: location.textDocument,
			taskType: type
		};
	};
};

export const createTaskCommandFetchParamConverter: (type: TaskCommandType) => ((location: DocumentLocation) => Promise<TaskCommandFetchParams>) =
function(type: TaskType) {
	return async function(location: DocumentLocation) {

		return {
			textDocument: location.textDocument,
			taskCommandType: type			
		};
	};
};