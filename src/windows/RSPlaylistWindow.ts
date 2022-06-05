import { BrowserWindow } from "electron"

export default class RSPlaylistWindow extends BrowserWindow {
  constructor() {
    super({ width: 800, height: 800 })
    this.loadURL("https://rsplaylist.com/")
  }

  async getChannel(): Promise<string | undefined> {
    try {
      return await this.webContents.executeJavaScript("document.querySelector('div.twitch-login-user').innerText")
    } catch {
      return undefined
    }
  }
}