import { _Connection, _, Definition, DefinitionLink, DefinitionParams, Location, ReferenceParams, ServerRequestHandler, TypeDefinitionParams } from "vscode-languageserver";
import { ConnectionEventHandler } from "./handler";

export const definitionHandler : ConnectionEventHandler = {
    register: function (connection: _Connection<_, _, _, _, _, _, _>): void {
        
        connection.onDefinition(onDefinition);
        connection.onTypeDefinition(onTypeDefinition);
        connection.onReferences(onReferences);
    },
    capabilities: {

        definitionProvider: true,
        typeDefinitionProvider: true,
        referencesProvider: true
    }
};

const onDefinition: ServerRequestHandler<DefinitionParams, Definition | DefinitionLink[] | undefined | null, Location[] | DefinitionLink[], void> =
async function(params, token, workDoneProgress, resultProgress) {
    
    console.log("Definition: ", params);
    return [];
};

const onTypeDefinition: ServerRequestHandler<TypeDefinitionParams, Definition | DefinitionLink[] | undefined | null, Location[] | DefinitionLink[], void> =
async function(params, token, workDoneProgress, resultProgress) {
    
    console.log("TypeDefinition: ", params);
    return [];
};

const onReferences: ServerRequestHandler<ReferenceParams, Location[] | undefined | null, Location[], void> =
async function(params, token, workDoneProgress, resultProgress) {
    

    console.log("References: ", params);
    return [];
};