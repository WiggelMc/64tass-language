import { Diagnostic, DiagnosticSeverity, languages as VSlanguages, Uri } from "vscode";
import { DocumentLocation } from "../common/capabilities/list-file";

interface LanguagesAccessor {
	getDiagnostics(resource: Uri): Diagnostic[]
}

export class ErrorPositionUtil {
    private languages: LanguagesAccessor;

	private errorShown = true;

	constructor(languages: LanguagesAccessor) {
		this.languages = languages;
	}

    resetErrorJumping() {
        this.errorShown = false;
    }

	async getErrorLocation(uris: readonly Uri[], isAllowed: boolean): Promise<DocumentLocation | undefined> {

		if (!isAllowed) {
			this.errorShown = true;
			return undefined;
		}

		if (this.errorShown) {
			return undefined;
		}

		for (const uri of uris) {
			const error = this.languages.getDiagnostics(uri)
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

				this.errorShown = true;
                return location;
			}
		}

		return undefined;
	};
}

export const errorPositionUtil = new ErrorPositionUtil(VSlanguages);