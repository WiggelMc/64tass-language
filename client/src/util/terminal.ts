import { Diagnostic, ExtensionTerminalOptions, languages as VSlanguages, TerminalOptions, Uri, workspace as VSworkspace, WorkspaceFolder } from "vscode";

interface WorkspaceAccessor {
    workspaceFolders: readonly WorkspaceFolder[] | undefined
}

interface LanguagesAccessor {
    getDiagnostics(resource: Uri): Diagnostic[]
}

export class TerminalUtil {
    private workspace: WorkspaceAccessor;
    private languages: LanguagesAccessor;


	constructor(workspace: WorkspaceAccessor, languages: LanguagesAccessor) {
		this.workspace = workspace;
		this.languages = languages;
	}


    getWorkspaceFolder(terminalOptions: Readonly<TerminalOptions | ExtensionTerminalOptions>, relativePath: string): string {

        for (const folder of this.workspace.workspaceFolders) {
    
            const diagnostics = this.languages.getDiagnostics(Uri.parse(folder.uri.toString() + "/" + relativePath))
                .filter(
                    d => d.source === "64tass Assembler"
                );
    
            if (diagnostics.length > 0) {
                return folder.uri.toString();
            }
        }
    
        if ((<TerminalOptions>terminalOptions).cwd !== undefined) {
            return (<TerminalOptions>terminalOptions).cwd.toString();
    
        } else if (this.workspace.workspaceFolders.length > 0) {
            return this.workspace.workspaceFolders[0].uri.toString();
    
        } else {
            return "";
        }
    }
}

export const terminalUtil = new TerminalUtil(VSworkspace, VSlanguages);