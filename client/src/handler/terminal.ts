import { CancellationToken, DiagnosticSeverity, ExtensionTerminalOptions, languages, ProviderResult, TerminalOptions, Uri, workspace, DiagnosticChangeEvent, TerminalLink, TerminalLinkProvider, TerminalLinkContext, window } from "vscode";
import { Range } from "vscode-languageclient";
import { DocumentLocation } from "../common/capabilities/list-file";
import { gotoDocumentLocation } from "../util/list-file-utils";
import { config } from "./config";
import { displayErrorMessage } from "./error";
import { ClientInitHandler } from "./handler";

export const terminalHandler: ClientInitHandler = {
    register(context) {
        return [
            languages.onDidChangeDiagnostics(onDidChangeDiagnostics),
		    window.registerTerminalLinkProvider(new TassTerminalLinkProvider()),
        ];
    },
};

class TassTerminalLinkProvider implements TerminalLinkProvider<TassTerminalLink> {
	provideTerminalLinks(context: TerminalLinkContext, token: CancellationToken): ProviderResult<TassTerminalLink[]> {

		const match = context.line.match("^([^:]*):(\\d+:\\d+): (error|warning): (.*)$");

		if (match === null) {
			return [];
		}


		const relativePath = match.at(1);
		const position = match.at(2).split(":").map(Number).map(n => n-1);


		let workspaceFolder = "";

		const terminalOptions: Readonly<TerminalOptions | ExtensionTerminalOptions> = context.terminal.creationOptions;

		if ((<TerminalOptions>terminalOptions).cwd !== undefined) {
			workspaceFolder = (<TerminalOptions>terminalOptions).cwd.toString();

		} else if (workspace.workspaceFolders.length > 0) {
			workspaceFolder = workspace.workspaceFolders[0].uri.toString();

		}

		for (const folder of workspace.workspaceFolders) {

			const diagnostics = languages.getDiagnostics(Uri.parse(folder.uri.toString() + "/" + relativePath))
			.filter(
				d => d.source === "64tass Assembler"
			);

			if (diagnostics.length > 0) {
				workspaceFolder = folder.uri.toString();
				break;
			}
		}


		const path = workspaceFolder + "/" + relativePath;

		const location: DocumentLocation = {
			textDocument: {uri: path},
			range: Range.create(position[0],position[1],position[0],position[1])
		};
		
		return [
			new TassTerminalLink(0, context.line.length, location, "Open in Editor")
		];
	}

	handleTerminalLink(link: TassTerminalLink): ProviderResult<void> {
		gotoDocumentLocation(link.location)
		.catch(displayErrorMessage);
	}
}

class TassTerminalLink extends TerminalLink {
	location: DocumentLocation;

	constructor(startIndex: number, length: number, location: DocumentLocation, tooltip?: string) {
		super(startIndex, length, tooltip);

		this.location = location;
	}
}

let errorShown = true;

export function setErrorShown(state: boolean) {
    errorShown = state;
}

const onDidChangeDiagnostics: (e: DiagnosticChangeEvent) => any =
async function(e) {

	if (!config.get("assemble.goto-error")) {
		setErrorShown(true);
		return;
	}

	if (errorShown) {
		return;
	}
	
	for (const uri of e.uris) {
		const error = languages.getDiagnostics(uri)
		.filter(
			d => d.source === "64tass Assembler" &&
			d.severity === DiagnosticSeverity.Error
		)
		.at(0);

		if (error !== undefined) {

			const location: DocumentLocation = {
				textDocument: {
					uri: uri.toString()
				},
				range: error.range
			};

			
			gotoDocumentLocation(location)
			.catch(displayErrorMessage);

			setErrorShown(true);
			return;
		}
	}
};