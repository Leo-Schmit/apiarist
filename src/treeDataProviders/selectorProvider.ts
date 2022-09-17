import * as path from "path";
import {
  commands,
  Event,
  EventEmitter,
  ThemeIcon,
  TreeDataProvider,
  TreeItem,
  TreeItemCollapsibleState,
  Uri,
  workspace,
  window,
} from "vscode";
import { parse } from "yaml";
import { SelectorEntry } from "../interfaces/selectorEntryInterface";
import { isFileExist } from "../services/isFileExist";
import { parseYml } from "../services/parseYml";

export class SelectorProvider implements TreeDataProvider<SelectorEntry> {
  private treeItems: any[];
  private _onDidChangeTreeData: EventEmitter<any[] | undefined> = new EventEmitter<any[] | undefined>();
  public onDidChangeTreeData: Event<any> = this._onDidChangeTreeData.event;

  constructor() {
    if (!workspace.workspaceFolders || workspace.workspaceFolders.length === 0) {
      window.showErrorMessage(`Please open any folder first.`);
    }
  }

  collapse(): void {
    commands.executeCommand("workbench.actions.treeView.selector.collapseAll");
    this._onDidChangeTreeData.fire(null);
  }

  refresh(): void {
    this._onDidChangeTreeData.fire(null);
  }

  private replaceChildrenAndAddLevel = (yml: string | any[]) => {
    for (let i = 0; i < yml.length; i++) {
      const element = yml[i];
      let k = 0;
      for (let j = 0; j < element.length; j++) {
        element[j].level = i;
        if (element[j].children) {
          const length = element[j].children.length;
          element[j].children = [k, length];
          k += length;
        }
      }
    }
  };

  private async parseRoutes() {
    if (!workspace.workspaceFolders || workspace.workspaceFolders.length === 0) {
      window.showErrorMessage(`Please open any folder first.`);
      return null;
    }

    const apiaristPath = path.join(
      workspace.workspaceFolders[0].uri.fsPath,
      workspace.getConfiguration().get("apiarist.directory")
    );

    let fileExist = await isFileExist(apiaristPath);
    if (!fileExist) {
      commands.executeCommand("setContext", "apiarist.no_directory", true);
    }
    const routesPath = path.join(apiaristPath, "routes.yaml");
    fileExist = await isFileExist(routesPath);
    if (!fileExist) {
      return null;
    }
    const file = await workspace.fs.readFile(Uri.file(routesPath));

    const yml = parse(String.fromCharCode.apply(null, file));
    const moduleFiles = [];
    if (yml["title"]) {
      commands.executeCommand("selector.changeTitle", yml["title"]);
    }
    yml["routes"].forEach((el: { children: any[] }) => parseYml(el, 0, moduleFiles));
    this.replaceChildrenAndAddLevel(moduleFiles);

    return moduleFiles;
  }

  async getChildren(element?: SelectorEntry): Promise<SelectorEntry[]> {
    if (element) {
      const returnArr = [];
      if (element.children) {
        const maxI = element.children[0] + element.children[1];
        for (let i = element.children[0]; i < maxI; i++) {
          const el = this.treeItems[element.level + 1][i];
          returnArr.push(el);
        }
      }
      return returnArr;
    }

    this.treeItems = await this.parseRoutes();
    if (!this.treeItems) {
      return [];
    }

    return this.treeItems[0];
  }

  getTreeItem(element: SelectorEntry): TreeItem {
    const expand = element.children;
    const treeItem = new TreeItem(
      element.name,
      expand ? TreeItemCollapsibleState.Expanded : TreeItemCollapsibleState.None
    );

    if (expand) {
      treeItem.iconPath = new (ThemeIcon as any)("folder");
    }
    treeItem.command = {
      command: "selector.openFile",
      title: "Open File",
      arguments: [element],
    };
    return treeItem;
  }
}
