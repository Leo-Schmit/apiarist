import {
  commands,
  DocumentSymbol,
  Range,
  Selection,
  TextDocument,
  TextEditor,
  TextEditorRevealType,
  Uri,
  window,
  workspace
} from "vscode";
import { getWorkspaceDirectory } from "./services/getWorkspaceDirectory";
import { isFileExist } from "./services/isFileExist";
import { sleep } from "./services/sleep";
import { ApiaristViewerProvider } from "./treeDataProviders/apiaristViewerProvider";

export class ApiaristViewer {
  private treeDataProvider: ApiaristViewerProvider;
  constructor() {
    const treeDataProvider = new ApiaristViewerProvider();
    this.treeDataProvider = treeDataProvider;

    window.createTreeView("apiaristViewer", { treeDataProvider });
    this.registerCommands();
  }

  private registerCommands() {
    commands.registerCommand("apiaristViewer.openFile", (resource) => this.openFile(resource));
    commands.registerCommand("apiaristViewer.refresh", () => this.refresh());
    commands.registerCommand("apiaristViewer.reRenderModule", (ymlPath: string) => this.reRenderModule(ymlPath));
    commands.registerCommand("apiaristViewer.collapse", () => this.collapse());
  }

  private async parseDoc(resourcePath: string): Promise<[TextEditor, DocumentSymbol[], TextDocument]> {
    const documentPath = Uri.joinPath(getWorkspaceDirectory(), resourcePath);
    const fileExist = await isFileExist(documentPath);
    if (!fileExist) {
      window.showErrorMessage(`No such file or directory, open ${documentPath}`);
      return;
    }

    let docSymbols: DocumentSymbol[];
    let doc: TextDocument;
    let editor: TextEditor;
    let i = 0;
    while (!docSymbols && i < 50) {
      i++;
      doc = await workspace.openTextDocument(documentPath);
      editor = await window.showTextDocument(doc, { preserveFocus: true });
      const currentUrl = editor.document.uri;
      docSymbols = (await commands.executeCommand(
        "vscode.executeDocumentSymbolProvider",
        currentUrl
      )) as DocumentSymbol[];
      if (!docSymbols) await sleep(0.1);
    }

    if (!docSymbols) {
      window.showErrorMessage(`Can't parse ${doc.fileName}. Please make sure you have extension for this language`);
      return;
    }
    return [editor, docSymbols, doc];
  }

  private async openFile(resource: any): Promise<void> {
    const [editor, docSymbols, doc] = await this.parseDoc(resource.path);

    let range: Range;
    if (resource.regexp) {
      const text = editor.document.getText();
      const [match] = text.matchAll(new RegExp(resource.regexp.pattern, resource.regexp.flags ?? "g"));
      const startPos = editor.document.positionAt(match.index);
      const endPos = editor.document.positionAt(match.index + match[0].length);
      editor.selection = new Selection(startPos, endPos);
      range = new Range(startPos, startPos);
    } else {
      resource.call = resource.call.replaceAll("\\.", "#tmp_point#");
      const splittedName = resource.call.split(".");

      try {
        range = this.searchInDocSymbols(splittedName, docSymbols);
      } catch (error) {
        window.showErrorMessage(`Can't find ${resource.call.replaceAll("#tmp_point#", ".")} in ${doc.fileName}`);
        return;
      }
    }

    editor.revealRange(range, TextEditorRevealType.AtTop);
  }

  private searchInDocSymbols = (splittedName: string[], docSymbols: DocumentSymbol[]) => {
    const name = splittedName[0].replaceAll("#tmp_point#", ".");
    const i = docSymbols.findIndex((element) => element.name == name);
    if (splittedName.length > 1) {
      splittedName.splice(0, 1);
      return this.searchInDocSymbols(splittedName, docSymbols[i].children);
    } else {
      return docSymbols[i].range;
    }
  };

  private refresh(): void {
    this.treeDataProvider.refresh();
  }

  private reRenderModule(ymlPath: string): void {
    this.treeDataProvider.refresh(ymlPath);
  }

  private collapse(): void {
    this.treeDataProvider.collapse();
  }
}
