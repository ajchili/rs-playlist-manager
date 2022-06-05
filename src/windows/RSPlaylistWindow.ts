import { BrowserWindow } from "electron"

export default class RSPlaylistWindow extends BrowserWindow {
    constructor() {
        super({ width: 800, height: 800, show: false })
        this.loadURL("https://rsplaylist.com/")
    }
}