const { app, BrowserWindow } = require('electron')

let channel: string | undefined;

const createWindow = () => {
    const applicationWindow = new BrowserWindow({ width: 800, height: 800 })
    applicationWindow.hide()

    applicationWindow.loadFile("./index.html")
    applicationWindow.webContents.on("did-navigate", (_: any, url: string) => {
        if (url.includes("move-request")) {
            applicationWindow.webContents.goBack();
        }
    })

    const playlistWindow = new BrowserWindow({ width: 800, height: 800 })
    playlistWindow.hide()
    playlistWindow.loadURL("https://rsplaylist.com/")
    playlistWindow.webContents.on("did-navigate", () => {
        playlistWindow.webContents.executeJavaScript("document.querySelector('div.twitch-login-user').innerText").then((user: string) => {
            if (user) {
                channel = user;
                playlistWindow.close()
                applicationWindow.show()
            } else {
                playlistWindow.show()
            }
        }).catch(() => playlistWindow.show())
    })
}

app.whenReady().then(() => {
    createWindow()
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})