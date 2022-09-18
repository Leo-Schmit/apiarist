import { workspace, Uri } from "vscode";

export const isFileExist = async (filepath: Uri) => {
  try {
    await workspace.fs.stat(filepath);
  } catch (err) {
    return false;
  }
  return true;
};
