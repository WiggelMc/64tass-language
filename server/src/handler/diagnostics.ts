import { _Connection, _, DiagnosticServerCancellationData, DocumentDiagnosticParams, DocumentDiagnosticReport, DocumentDiagnosticReportPartialResult, ServerRequestHandler, WorkspaceDiagnosticParams, WorkspaceDiagnosticReport, WorkspaceDiagnosticReportPartialResult, Diagnostic, Range, DiagnosticSeverity, DiagnosticTag } from "vscode-languageserver";
import { Selector } from "../common/capabilities/document-selector";
import { ConnectionEventHandler } from "./handler";

export const diagnosticsHandler : ConnectionEventHandler = {
    register: function (connection: _Connection<_, _, _, _, _, _, _>): void {
        
        connection.languages.diagnostics.on(onDiagnostics);
        connection.languages.diagnostics.onWorkspace(onWorkspaceDiagnostics);
    },
    capabilities: {

        diagnosticProvider: {
            interFileDependencies: true,
            documentSelector: Selector.all,
            workspaceDiagnostics: false
        }
    }
};

const onDiagnostics: ServerRequestHandler<DocumentDiagnosticParams, DocumentDiagnosticReport, DocumentDiagnosticReportPartialResult, DiagnosticServerCancellationData> =
async function(params, token, workDoneProgress, resultProgress) {

    console.log("Diagnostics: ", params);
    return {
        kind: "full",
        items: [
            Diagnostic.create(Range.create(0,0,0,10), "FishError1", DiagnosticSeverity.Error, 404, "fishes"),
            Diagnostic.create(Range.create(1,0,1,10), "FishHint2", DiagnosticSeverity.Hint, 404, "fishes"),
            Diagnostic.create(Range.create(2,0,2,10), "FishInfo3", DiagnosticSeverity.Information, 404, "fishes"),
            Diagnostic.create(Range.create(3,0,3,10), "FishWarn4", DiagnosticSeverity.Warning, 404, "fishes"),
            {...Diagnostic.create(Range.create(4,0,4,10), "FishUnnecessary5", DiagnosticSeverity.Hint, 404, "fishes"), tags: [DiagnosticTag.Unnecessary]},
            {...Diagnostic.create(Range.create(5,0,5,10), "FishDeprecated6", DiagnosticSeverity.Hint, 404, "fishes"), tags: [DiagnosticTag.Deprecated]},
        ]
    };
};

const onWorkspaceDiagnostics: ServerRequestHandler<WorkspaceDiagnosticParams, WorkspaceDiagnosticReport, WorkspaceDiagnosticReportPartialResult, DiagnosticServerCancellationData> =
async function(params, token, workDoneProgress, resultProgress) {

    console.log("Workspace Diagnostics: ", params);
    return {
        items: [

        ]
    };
};