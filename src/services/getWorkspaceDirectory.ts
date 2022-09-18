import { Uri, workspace } from "vscode";

export const getWorkspaceDirectory = () => {
  if (!workspace.workspaceFolders || workspace.workspaceFolders.length === 0 || !workspace.workspaceFolders[0]) {
    return null;
  }

  const uri = workspace.workspaceFolders[0].uri;
  return Uri.parse(uri.scheme + "://" + uri.authority + uri.fsPath);
};
