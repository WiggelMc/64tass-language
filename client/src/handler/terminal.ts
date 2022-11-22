import { CancellationToken, languages as VSlanguages, ProviderResult, DiagnosticChangeEvent, TerminalLink, TerminalLinkProvider, TerminalLinkContext, window as VSwindow, ExtensionContext, Disposable, Event } from "vscode";
import { Range as ClientRange } from "vscode-languageclient";
import { DocumentLocation } from "../common/capabilities/list-file";
import { ConfigSection, ConfigUtil, configUtil } from "../util/config";
import { ErrorUtil, errorUtil } from "../util/error";
import { ClientHandler } from "../handler";
import { GotoUtil, gotoUtil } from "../util/goto";
import { TerminalUtil, terminalUtil } from "../util/terminal";
import { ErrorPositionUtil, errorPositionUtil } from "../util/error-position";

interface LanguagesAccessor {
	onDidChangeDiagnostics: Event<DiagnosticChangeEvent>
}

interface WindowAccessor {
	registerTerminalLinkProvider(provider: TerminalLinkProvider): Disposable
}

export class TerminalHandler implements ClientHandler {
	private languages: LanguagesAccessor;
	private window: WindowAccessor;

	private config: ConfigUtil;
	private error: ErrorUtil;
	private goto: GotoUtil;
	private terminal: TerminalUtil;
	private errorPosition: ErrorPositionUtil;

	constructor(languages: LanguagesAccessor, window: WindowAccessor, config: ConfigUtil, error: ErrorUtil, goto: GotoUtil, terminal: TerminalUtil, errorPosition: ErrorPositionUtil) {
		this.languages = languages;
		this.window = window;

		this.config = config;
		this.error = error;
		this.goto = goto;
		this.terminal = terminal;
		this.errorPosition = errorPosition;
	}

	register(context: ExtensionContext): Disposable[] {
		return [
			this.languages.onDidChangeDiagnostics(this.onDidChangeDiagnostics),
			this.window.registerTerminalLinkProvider({
				provideTerminalLinks: this.provideTerminalLinks,
				handleTerminalLink: this.handleTerminalLink
			}),
		];
	}

	async onDidChangeDiagnostics(e: DiagnosticChangeEvent) {

		const isAllowed: boolean = this.config.getConfigOption(ConfigSection.assembleGotoError);

		const location = await this.errorPosition.getErrorLocation(e.uris, isAllowed);

		if (location !== undefined) {
			this.goto.gotoDocumentLocation(location)
					.catch(this.error.displayErrorMessage);
		}
	}

	provideTerminalLinks(context: TerminalLinkContext, token: CancellationToken): ProviderResult<TassTerminalLink[]> {

		const match = context.line.match("^([^:]*):(\\d+:\\d+): (error|warning): (.*)$");

		if (match === null) {
			return [];
		}

		const relativePath = match.at(1);
		const workspaceFolder = this.terminal.getWorkspaceFolder(context.terminal.creationOptions, relativePath);

		const path = workspaceFolder + "/" + relativePath;
		const position = match.at(2).split(":").map(Number).map(n => n - 1);
		const location: DocumentLocation = {
			textDocument: { uri: path },
			range: ClientRange.create(position[0], position[1], position[0], position[1])
		};

		return [
			new TassTerminalLink(0, context.line.length, location, "Open in Editor")
		];
	}

	handleTerminalLink(link: TassTerminalLink): ProviderResult<void> {
		this.goto.gotoDocumentLocation(link.location)
			.catch(this.error.displayErrorMessage);
	}
}

export const terminalHandler = new TerminalHandler(VSlanguages, VSwindow, configUtil, errorUtil, gotoUtil, terminalUtil, errorPositionUtil);

class TassTerminalLink extends TerminalLink {
	location: DocumentLocation;

	constructor(startIndex: number, length: number, location: DocumentLocation, tooltip?: string) {
		super(startIndex, length, tooltip);

		this.location = location;
	}
}