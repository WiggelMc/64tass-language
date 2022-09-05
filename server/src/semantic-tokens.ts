import { SemanticTokens, SemanticTokensLegend, SemanticTokensParams, SemanticTokensPartialResult, SemanticTokensRangeRequest } from "vscode-languageserver";

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