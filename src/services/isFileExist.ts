import { workspace, Uri } from "vscode";

export const isFileExist = async (filepath: string) => {
  try {
    await workspace.fs.stat(Uri.parse(filepath));
  } catch (err) {
    return false;
  }
  return true;
};
