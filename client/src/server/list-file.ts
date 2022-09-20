import { DocumentLocation, OptionalDocumentLocation, ViewInListFileRequest, ViewInSourceFileRequest } from "../common/capabilities/list-file";
import { client } from "../util/languageclient";


export async function sendViewInListFileRequest(params: DocumentLocation): Promise<DocumentLocation> {

    const r: OptionalDocumentLocation = await client.sendRequest(ViewInListFileRequest.method, params);

    if (r === undefined || r === null) {
        throw new Error("List File not Found");
    }

    return r;
};

export async function sendViewInSourceFileRequest(params: DocumentLocation): Promise<DocumentLocation> {

    const r: OptionalDocumentLocation = await client.sendRequest(ViewInSourceFileRequest.method, params);

    if (r === undefined || r === null) {
        throw new Error("Source File not Found");
    }

    return r;
};