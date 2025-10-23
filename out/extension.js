"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
const vscode = require("vscode");
function activate(context) {
    const disposable = vscode.commands.registerCommand('extension.runCopilotModelsTest', async () => {
        // with gpt-4, this works fine, a tool call is returned
        let model = (await vscode.lm.selectChatModels({ vendor: 'copilot', family: 'gpt-4' }))[0];
        await createModelRequest(model);
        // with claude-sonnet-4, or any other model from Anthropic, this fails and an error like this is thrown: Error: Invalid JSON for tool call
        model = (await vscode.lm.selectChatModels({ vendor: 'copilot', family: 'claude-sonnet-4' }))[0];
        await createModelRequest(model);
    });
    context.subscriptions.push(disposable);
}
async function createModelRequest(model) {
    const response = await model.sendRequest([
        {
            role: vscode.LanguageModelChatMessageRole.User,
            content: [new vscode.LanguageModelTextPart('What is the current time?')],
            name: 'test-user'
        }
    ], {
        tools: [
            {
                name: 'get-time',
                description: 'Returns the current time',
                inputSchema: undefined
            }
        ]
    });
    for await (const part of response.stream) {
        console.log(part);
    }
}
//# sourceMappingURL=extension.js.map