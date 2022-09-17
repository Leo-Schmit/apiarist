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
} from "vscode";
import { parse } from "yaml";
import { ViewerEntry } from "../interfaces/viewerEntryInterface";
import { isFileExist } from "../services/isFileExist";
import { parseYml } from "../services/parseYml";

export class ApiaristViewerProvider implements TreeDataProvider<ViewerEntry> {
  private treeItems: ViewerEntry[][];
  private _onDidChangeTreeData: EventEmitter<any[] | undefined> = new EventEmitter<any[] | undefined>();
  public onDidChangeTreeData: Event<any> = this._onDidChangeTreeData.event;
  ymlPath: any;
  vscodeIcons: [][];
  iconsFiles: [][];
  apiaristPath: string;

  private replaceChildren(yml: string | any[]) {
    for (let i = 0; i < yml.length; i++) {
      const element = yml[i];
      let k = 0;
      for (let j = 0; j < element.length; j++) {
        if (element[j].children) {
          const length = element[j].children.length;
          element[j].children = [k, length];
          k += length;
        }
      }
    }
  }

  private addLevelAndPath(yml: string | any[]) {
    for (let i = 0; i < yml.length; i++) {
      const element = yml[i];
      for (let j = 0; j < element.length; j++) {
        element[j].level = i;
        let m = i;
        while (!element[j].path && m > 0) {
          m--;
          yml[m].forEach((el: { children: any[]; path: any }) => {
            if (!el.children) {
              return;
            }
            if (j >= el.children[0] && j < el.children[0] + el.children[1]) {
              element[j].path = el.path;
            }
          });
        }
      }
    }
  }

  private async parseYmlFile(ymlPath: string) {
    const file = await workspace.fs.readFile(Uri.file(ymlPath));
    const yml = parse(String.fromCharCode.apply(null, file));
    const tree: ViewerEntry[][] = [];
    yml["viewer"].forEach((el: { children: any[] }) => parseYml(el, 0, tree));
    this.replaceChildren(tree);
    this.addLevelAndPath(tree);

    return tree;
  }

  private async parseIcons(apiaristPath: string) {
    const iconsPath = path.join(apiaristPath, "icons.yaml");
    const vscodeIcons = [];
    const iconsFiles = [];

    const fileExist1 = await isFileExist(iconsPath);
    if (fileExist1) {
      const fileTypes = await workspace.fs.readFile(Uri.file(iconsPath));
      const ymlTypes = parse(String.fromCharCode.apply(null, fileTypes));
      ymlTypes["icons"].forEach((el) => {
        if (el.icon) {
          vscodeIcons[el.name] = el.icon;
        } else if (el.iconFile) {
          iconsFiles[el.name] = el.iconFile;
        }
      });
    }
    return [vscodeIcons, iconsFiles];
  }

  async getChildren(element?: ViewerEntry): Promise<ViewerEntry[]> {
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

    if (!this.ymlPath) {
      return [];
    }

    this.apiaristPath = path.join(
      workspace.workspaceFolders[0].uri.fsPath,
      workspace.getConfiguration().get("apiarist.directory")
    );

    [this.vscodeIcons, this.iconsFiles] = await this.parseIcons(this.apiaristPath);

    this.treeItems = await this.parseYmlFile(this.ymlPath);

    return this.treeItems[0];
  }

  getTreeItem(element: ViewerEntry): TreeItem {
    const expand = element.children;
    const collapsed = element.status == "collapsed";
    const treeItem = new TreeItem(
      element.name ?? element.call,
      expand ? TreeItemCollapsibleState.Expanded : TreeItemCollapsibleState.None
    );
    if (collapsed) {
      treeItem.collapsibleState = TreeItemCollapsibleState.Collapsed;
    }

    if (element.icon && this.vscodeIcons[element.icon]) {
      treeItem.iconPath = new (ThemeIcon as any)(this.vscodeIcons[element.icon]);
    } else if (element.icon && this.iconsFiles[element.icon]) {
      const icon = {
        light: Uri.file(path.join(this.apiaristPath, "icons", this.iconsFiles[element.icon]["light"])),
        dark: Uri.file(path.join(this.apiaristPath, "icons", this.iconsFiles[element.icon]["dark"])),
      };
      treeItem.iconPath = icon;
    }
    treeItem.command = {
      command: "apiaristViewer.openFile",
      title: "Open File",
      arguments: [element],
    };

    return treeItem;
  }

  collapse(): void {
    commands.executeCommand("workbench.actions.treeView.apiaristViewer.collapseAll");
    this._onDidChangeTreeData.fire(null);
  }

  refresh(ymlPath = null): void {
    if (ymlPath) {
      this.ymlPath = ymlPath;
    }
    this._onDidChangeTreeData.fire(null);
  }
}
