import { BrowserWindow } from "electron";
import CyclicalPlaylistManager from "../playlists/CyclicalPlaylistManager";

export default class ApplicationWindow extends BrowserWindow {
  private channel?: string;

  constructor() {
    super({ width: 800, height: 800, show: false })
    this.loadFile("./index.html")
    this.webContents.on("did-navigate", (_: any, url: string) => {
      if (url.includes("move-request")) {
        this.webContents.goBack()
      }
    })
  }

  setChannel(channel: string): void {
    // TODO: Do playlist management better!
    this.channel = channel
    const manager = new CyclicalPlaylistManager({ channel })
    this.on("close", () => manager.close())
  }
}