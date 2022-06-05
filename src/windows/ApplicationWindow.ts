import { BrowserWindow } from "electron";

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
        this.channel = channel
    }
}