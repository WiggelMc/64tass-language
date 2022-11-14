import { DocumentLocation } from "../common/capabilities/list-file";
import { TaskCommandFetchParams, TaskCommandType, TaskFetchParams, TaskType } from "../common/capabilities/task";

export async function createTaskFetchParams(location: DocumentLocation, type: TaskType): Promise<TaskFetchParams> {
	return {
		textDocument: location.textDocument,
		taskType: type
	};
}

export async function createTaskCommandFetchParams(location: DocumentLocation, type: TaskCommandType): Promise<TaskCommandFetchParams> {
	return {
		textDocument: location.textDocument,
		taskCommandType: type			
	};
}