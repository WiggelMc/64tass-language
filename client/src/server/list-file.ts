import { DocumentLocation, OptionalDocumentLocation, ViewInListFileRequest, ViewInSourceFileRequest } from "../common/capabilities/list-file";
import { client } from "../util/languageclient";


export async function sendViewInListFileRequest(params: DocumentLocation): Promise<DocumentLocation> {

    const r: OptionalDocumentLocation = await client.sendRequest(ViewInListFileRequest.method, params);

    if (r === undefined || r === null) {
        throw new ListFileNotFoundError();
    }

    return r;
};

export async function sendViewInSourceFileRequest(params: DocumentLocation): Promise<DocumentLocation> {

    const r: OptionalDocumentLocation = await client.sendRequest(ViewInSourceFileRequest.method, params);

    if (r === undefined || r === null) {
        throw new SourceFileNotFoundError();
    }

    return r;
};


export class ListFileNotFoundError extends Error {
	constructor() {
		
		super(`The List File for the current Line could not be found`);
		this.name = "ListFileNotFoundError";
	}
}
export class SourceFileNotFoundError extends Error {
	constructor() {
		
		super(`The Source for the current Line could not be found`);
		this.name = "SourceFileNotFoundError";
	}
}