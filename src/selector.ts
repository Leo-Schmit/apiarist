import * as path from "path";
import { Uri, workspace, commands, window, TreeView } from "vscode";
import { buyerContent } from "./examples/buyer";
import { createMessageAsBuyerContent } from "./examples/createMessageAsBuyer";
import { createMessageAsSellerContent } from "./examples/createMessageAsSeller";
import { exampleContent } from "./examples/example";
import { iconsContent } from "./examples/icons";
import { handThumbsUpLight } from "./examples/icons/handThumbsUpLight";
import { handThumbsUpDark } from "./examples/icons/handThumbsUpDark";
import { routesContent } from "./examples/routes";
import { sellerContent } from "./examples/seller";
import { SelectorEntry } from "./interfaces/selectorEntryInterface";
import { isFileExist } from "./services/isFileExist";
import { SelectorProvider } from "./treeDataProviders/selectorProvider";

export class Selector {
  private treeDataProvider: SelectorProvider;
  tree: TreeView<SelectorEntry>;
  constructor() {
    const treeDataProvider = new SelectorProvider();
    this.treeDataProvider = treeDataProvider;
    this.tree = window.createTreeView("selector", { treeDataProvider });
    this.registerCommands();
  }

  private registerCommands() {
    commands.registerCommand("selector.openFile", (resource: SelectorEntry) => this.openFile(resource));
    commands.registerCommand("selector.changeTitle", (title) => this.changeTitle(title));
    commands.registerCommand("selector.refresh", () => this.refresh());
    commands.registerCommand("selector.collapse", () => this.collapse());
    commands.registerCommand("selector.createSamples", () => this.createSamples());
  }

  private str2Uint8Array(str: string): Uint8Array {
    return Uint8Array.from(Array.from(str).map((letter) => letter.charCodeAt(0)));
  }

  private async createSamples(): Promise<void> {
    const apiaristDir = path.join(
      workspace.workspaceFolders[0].uri.fsPath,
      workspace.getConfiguration().get("apiarist.directory")
    );
    let fileExist = await isFileExist(apiaristDir);
    if (!fileExist) {
      workspace.fs.createDirectory(Uri.file(apiaristDir));
    }

    const exampleDir = path.join(apiaristDir, "example");
    const routesFile = path.join(apiaristDir, "routes.yaml");
    const iconsFile = path.join(apiaristDir, "icons.yaml");
    const create_message_as_sellerFile = path.join(exampleDir, "create_message_as_seller.yaml");
    const create_message_as_buyerFile = path.join(exampleDir, "create_message_as_buyer.yaml");
    const sellerFile = path.join(exampleDir, "seller.yaml");
    const buyerFile = path.join(exampleDir, "buyer.yaml");
    const exampleFile = path.join(exampleDir, "example.js");
    fileExist = await isFileExist(routesFile);
    if (!fileExist) {
      fileExist = await isFileExist(exampleDir);
      if (!fileExist) {
        workspace.fs.createDirectory(Uri.file(exampleDir));
      }

      await workspace.fs.writeFile(
        Uri.file(routesFile),
        Uint8Array.from(Array.from(routesContent).map((letter) => letter.charCodeAt(0)))
      );
      await workspace.fs.writeFile(Uri.file(iconsFile), this.str2Uint8Array(iconsContent));
      await workspace.fs.writeFile(Uri.file(create_message_as_sellerFile), this.str2Uint8Array(createMessageAsSellerContent));
      await workspace.fs.writeFile(Uri.file(create_message_as_buyerFile), this.str2Uint8Array(createMessageAsBuyerContent));
      await workspace.fs.writeFile(Uri.file(sellerFile), this.str2Uint8Array(sellerContent));
      await workspace.fs.writeFile(Uri.file(buyerFile), this.str2Uint8Array(buyerContent));
      await workspace.fs.writeFile(Uri.file(exampleFile), this.str2Uint8Array(exampleContent));

      const iconPath = path.join(apiaristDir, "icons");
      fileExist = await isFileExist(iconPath);
      if (!fileExist) {
        workspace.fs.createDirectory(Uri.file(iconPath));
      }
      await workspace.fs.writeFile(
        Uri.file(path.join(iconPath, "hand-thumbs-up-dark.svg")),
        this.str2Uint8Array(handThumbsUpDark)
      );
      await workspace.fs.writeFile(
        Uri.file(path.join(iconPath, "hand-thumbs-up-light.svg")),
        this.str2Uint8Array(handThumbsUpLight)
      );

      commands.executeCommand("selector.refresh");
    }
  }

  private changeTitle(title: string): void {
    this.tree.title = title;
  }

  private async openFile(resource: SelectorEntry): Promise<void> {
    let pathById = path.join(
      workspace.workspaceFolders[0].uri.fsPath,
      workspace.getConfiguration().get("apiarist.directory"),
      resource.id
    );

    let fileExist1 = await isFileExist(pathById);
    let fileExist2 = await isFileExist(pathById + ".yaml");
    if (!fileExist1 && fileExist2) {
      pathById = pathById + ".yaml";
    }

    fileExist1 = await isFileExist(pathById);
    fileExist2 = await isFileExist(pathById + ".yml");
    if (!fileExist1 && fileExist2) {
      pathById = pathById + ".yml";
    }

    fileExist1 = await isFileExist(pathById);
    if (fileExist1) {
      commands.executeCommand("apiaristViewer.reRenderModule", pathById);
    }
  }

  private collapse(): void {
    this.treeDataProvider.collapse();
  }

  private refresh(): void {
    this.treeDataProvider.refresh();
  }
}
