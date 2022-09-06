import { CancellationToken, HandlerResult, ResultProgressReporter, SemanticTokens, SemanticTokensBuilder, SemanticTokensDelta, SemanticTokensDeltaParams, SemanticTokensDeltaPartialResult, SemanticTokensLegend, SemanticTokensParams, SemanticTokensPartialResult, SemanticTokensRangeParams, SemanticTokensRangeRequest, ServerRequestHandler, WorkDoneProgressReporter, _, _Connection } from "vscode-languageserver";
import { sleep } from "../util/sleep";

const tokenTypes = new Map<string, number>();
const tokenModifiers = new Map<string, number>();

export const legend = (function ():SemanticTokensLegend {
	const tokenTypesLegend = [
		't1', 't2', 't3', 'number', 'regexp', 'operator', 'namespace',
		'type', 'struct', 'class', 'interface', 'enum', 'typeParameter', 'function',
		'method', 'decorator', 'macro', 'variable', 'parameter', 'property', 'label'
	];
	tokenTypesLegend.forEach((tokenType, index) => tokenTypes.set(tokenType, index));

	const tokenModifiersLegend = [
		'declaration', 'documentation', 'readonly', 'static', 'abstract', 'deprecated',
		'modification', 'async'
	];
	tokenModifiersLegend.forEach((tokenModifier, index) => tokenModifiers.set(tokenModifier, index));

	return {
		tokenTypes: tokenTypesLegend,
    	tokenModifiers: tokenModifiersLegend
	};
})();


export function register(connection: _Connection<_, _, _, _, _, _, _>) {
    
    connection.languages.semanticTokens.on(onSemanticTokens);
	connection.languages.semanticTokens.onDelta(onSemanticTokensDelta);
	connection.languages.semanticTokens.onRange(onSemanticTokensRange);
}

/**
 * called when a document is opened
 */
const onSemanticTokens: ServerRequestHandler<SemanticTokensParams, SemanticTokens, SemanticTokensPartialResult, void> = 
async function(params, token, workDoneProgress, resultProgress) {
	
	console.log("Tokens Full: ",params);
	await sleep(5000);
	console.log("Tokens Full Done: ",params);
	let builder = new SemanticTokensBuilder();
	builder.push(0,2,10,0,0);
	return builder.build();
};

/**
 * called when the document has changed (from last full/delta)
 */
const onSemanticTokensDelta: ServerRequestHandler<SemanticTokensDeltaParams, SemanticTokensDelta | SemanticTokens, SemanticTokensDeltaPartialResult | SemanticTokensDeltaPartialResult, void> =
async function(params, token, workDoneProgress, resultProgress) {
	
	console.log("Tokens Delta: ",params);
	let builder = new SemanticTokensBuilder();
	return builder.build();
};

/**
 * only used when full tokens arent available yet
 */
const onSemanticTokensRange: ServerRequestHandler<SemanticTokensRangeParams, SemanticTokens, SemanticTokensPartialResult, void> =
async function(params, token, workDoneProgress, resultProgress) {
	
	console.log("Tokens Range: ",params);
	let builder = new SemanticTokensBuilder();
	builder.push(1,2,10,0,0);
	return builder.build();
};