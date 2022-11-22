import { CancellationToken, DiagnosticSeverity, languages as VSlanguages, ProviderResult, DiagnosticChangeEvent, TerminalLink, TerminalLinkProvider, TerminalLinkContext, window as VSwindow, ExtensionContext, Disposable, Event } from "vscode";
import { Range } from "vscode-languageclient";
import { DocumentLocation } from "../common/capabilities/list-file";
import { ConfigSection, configUtil } from "../util/config";
import { errorUtil } from "../util/error";
import { ClientHandler } from "../handler";
import { gotoUtil } from "../util/goto";
import { terminalUtil } from "../util/terminal";
import { errorPositionUtil } from "../util/error-position";

export const terminalHandler: ClientHandler = {
	register(context) {
		return [
			VSlanguages.onDidChangeDiagnostics(onDidChangeDiagnostics),
			VSwindow.registerTerminalLinkProvider(new TassTerminalLinkProvider()),
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
		const workspaceFolder = terminalUtil.getWorkspaceFolder(context.terminal.creationOptions, relativePath);

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

interface LanguagesAccessor {
	onDidChangeDiagnostics: Event<DiagnosticChangeEvent>
}

interface WindowAccessor {
	registerTerminalLinkProvider(provider: TerminalLinkProvider): Disposable
}

export class TerminalHandler implements ClientHandler {
	private languages: LanguagesAccessor;
	private window: WindowAccessor;

	constructor(languages: LanguagesAccessor, window: WindowAccessor) {
		this.languages = languages;
		this.window = window;
	}

	register(context: ExtensionContext): Disposable[] {
		return [
			this.languages.onDidChangeDiagnostics(onDidChangeDiagnostics),
			this.window.registerTerminalLinkProvider(new TassTerminalLinkProvider()),
		];
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

		const isAllowed: boolean = configUtil.getConfigOption(ConfigSection.assembleGotoError);

		const location = await errorPositionUtil.getErrorLocation(e.uris, isAllowed);

		if (location !== undefined) {
			gotoUtil.gotoDocumentLocation(location)
					.catch(errorUtil.displayErrorMessage);
		}
	};