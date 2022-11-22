import { CancellationToken, DiagnosticSeverity, ExtensionTerminalOptions, languages, ProviderResult, TerminalOptions, Uri, workspace, DiagnosticChangeEvent, TerminalLink, TerminalLinkProvider, TerminalLinkContext, window } from "vscode";
import { Range } from "vscode-languageclient";
import { DocumentLocation } from "../common/capabilities/list-file";
import { ConfigSection, configUtil } from "../util/config";
import { errorUtil } from "../util/error";
import { ClientHandler } from "../handler";
import { gotoUtil } from "../util/goto";

export const terminalHandler: ClientHandler = {
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
		const workspaceFolder = getWorkspaceFolder(context.terminal.creationOptions, relativePath);

		const path = workspaceFolder + "/" + relativePath;
		const position = match.at(2).split(":").map(Number).map(n => n - 1);
		const location: DocumentLocation = {
			textDocument: { uri: path },
			range: Range.create(position[0], position[1], position[0], position[1])
		};

		return [
			new TassTerminalLink(0, context.line.length, location, "Open in Editor")
		];
	}

	handleTerminalLink(link: TassTerminalLink): ProviderResult<void> {
		gotoUtil.gotoDocumentLocation(link.location)
			.catch(errorUtil.displayErrorMessage);
	}
}

function getWorkspaceFolder(terminalOptions: Readonly<TerminalOptions | ExtensionTerminalOptions>, relativePath: string): string {

	for (const folder of workspace.workspaceFolders) {

		const diagnostics = languages.getDiagnostics(Uri.parse(folder.uri.toString() + "/" + relativePath))
			.filter(
				d => d.source === "64tass Assembler"
			);

		if (diagnostics.length > 0) {
			return folder.uri.toString();
		}
	}

	if ((<TerminalOptions>terminalOptions).cwd !== undefined) {
		return (<TerminalOptions>terminalOptions).cwd.toString();

	} else if (workspace.workspaceFolders.length > 0) {
		return workspace.workspaceFolders[0].uri.toString();

	} else {
		return "";
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

export function resetTaskLinterDiagnostics() {
	errorShown = false;
}

const onDidChangeDiagnostics: (e: DiagnosticChangeEvent) => any =
	async function (e) {

		if (!configUtil.getConfigOption(ConfigSection.assembleGotoError)) {
			errorShown = true;
			return;
		}

		if (errorShown) {
			return;
		}

		for (const uri of e.uris) {
			const error = languages.getDiagnostics(uri)
				.filter(
					d => d.source === "64tass Assembler"
						&& d.severity === DiagnosticSeverity.Error
				)
				.at(0);

			if (error !== undefined) {

				const location: DocumentLocation = {
					textDocument: {
						uri: uri.toString()
					},
					range: error.range
				};


				gotoUtil.gotoDocumentLocation(location)
					.catch(errorUtil.displayErrorMessage);

				errorShown = true;
				return;
			}
		}
	};