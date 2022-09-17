import { ApiaristViewer } from "./apiaristViewer";
import { Selector } from "./selector";
import { ExtensionContext, workspace, commands } from "vscode";

export async function activate(context: ExtensionContext) {
  context.subscriptions.push(
    workspace.onDidChangeWorkspaceFolders(() => {
      console.log("onDidChangeWorkspaceFolders");
      commands.executeCommand("selector.refresh");
    })
  );

  new Selector();
  new ApiaristViewer();
}
