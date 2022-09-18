import { commands, TreeView, Uri, window, workspace } from "vscode";
import { buyerContent } from "./examples/buyer";
import { createMessageAsBuyerContent } from "./examples/createMessageAsBuyer";
import { createMessageAsSellerContent } from "./examples/createMessageAsSeller";
import { exampleContent } from "./examples/example";
import { iconsContent } from "./examples/icons";
import { handThumbsUpDark } from "./examples/icons/handThumbsUpDark";
import { handThumbsUpLight } from "./examples/icons/handThumbsUpLight";
import { routesContent } from "./examples/routes";
import { sellerContent } from "./examples/seller";
import { SelectorEntry } from "./interfaces/selectorEntryInterface";
import { getWorkspaceDirectory } from "./services/getWorkspaceDirectory";
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
    const workspaceDirectory = getWorkspaceDirectory();
    const apiaristDir = Uri.joinPath(workspaceDirectory, workspace.getConfiguration().get("apiarist.directory"));
    let fileExist = await isFileExist(apiaristDir);
    if (!fileExist) {
      workspace.fs.createDirectory(apiaristDir);
    }

    const exampleDir = Uri.joinPath(apiaristDir, "example");
    const routesFile = Uri.joinPath(apiaristDir, "routes.yaml");
    const iconsFile = Uri.joinPath(apiaristDir, "icons.yaml");
    const create_message_as_sellerFile = Uri.joinPath(exampleDir, "create_message_as_seller.yaml");
    const create_message_as_buyerFile = Uri.joinPath(exampleDir, "create_message_as_buyer.yaml");
    const sellerFile = Uri.joinPath(exampleDir, "seller.yaml");
    const buyerFile = Uri.joinPath(exampleDir, "buyer.yaml");
    const exampleFile = Uri.joinPath(exampleDir, "example.js");
    fileExist = await isFileExist(routesFile);
    if (!fileExist) {
      fileExist = await isFileExist(exampleDir);
      if (!fileExist) {
        workspace.fs.createDirectory(exampleDir);
      }

      await workspace.fs.writeFile(
        routesFile,
        Uint8Array.from(Array.from(routesContent).map((letter) => letter.charCodeAt(0)))
      );
      await workspace.fs.writeFile(iconsFile, this.str2Uint8Array(iconsContent));
      await workspace.fs.writeFile(create_message_as_sellerFile, this.str2Uint8Array(createMessageAsSellerContent));
      await workspace.fs.writeFile(create_message_as_buyerFile, this.str2Uint8Array(createMessageAsBuyerContent));
      await workspace.fs.writeFile(sellerFile, this.str2Uint8Array(sellerContent));
      await workspace.fs.writeFile(buyerFile, this.str2Uint8Array(buyerContent));
      await workspace.fs.writeFile(exampleFile, this.str2Uint8Array(exampleContent));

      const iconPath = Uri.joinPath(apiaristDir, "icons");
      fileExist = await isFileExist(iconPath);
      if (!fileExist) {
        workspace.fs.createDirectory(iconPath);
      }
      await workspace.fs.writeFile(
        Uri.joinPath(iconPath, "hand-thumbs-up-dark.svg"),
        this.str2Uint8Array(handThumbsUpDark)
      );
      await workspace.fs.writeFile(
        Uri.joinPath(iconPath, "hand-thumbs-up-light.svg"),
        this.str2Uint8Array(handThumbsUpLight)
      );

      commands.executeCommand("selector.refresh");
    }
  }

  private changeTitle(title: string): void {
    this.tree.title = title;
  }

  private async openFile(resource: SelectorEntry): Promise<void> {
    const apiaristDirectory = Uri.joinPath(
      getWorkspaceDirectory(),
      workspace.getConfiguration().get("apiarist.directory")
    );
    const pathById1 = Uri.joinPath(apiaristDirectory, resource.id);
    const fileExist1 = await isFileExist(pathById1);
    if (fileExist1) {
      commands.executeCommand("apiaristViewer.reRenderModule", pathById1);
      return;
    }
    const pathById2 = Uri.joinPath(apiaristDirectory, resource.id + ".yaml");
    const fileExist2 = await isFileExist(pathById2);
    if (fileExist2) {
      commands.executeCommand("apiaristViewer.reRenderModule", pathById2);
    }
    const pathById3 = Uri.joinPath(apiaristDirectory, resource.id + ".yml");
    const fileExist3 = await isFileExist(pathById3);
    if (fileExist3) {
      commands.executeCommand("apiaristViewer.reRenderModule", pathById3);
    }
  }

  private collapse(): void {
    this.treeDataProvider.collapse();
  }

  private refresh(): void {
    this.treeDataProvider.refresh();
  }
}
