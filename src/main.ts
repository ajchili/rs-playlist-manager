import { app, BrowserWindow } from 'electron'
import CyclicalPlaylistManager from './playlists/CyclicalPlaylistManager'

const createWindow = () => {
    const applicationWindow = new BrowserWindow({ width: 800, height: 800, show: false })
    applicationWindow.loadFile("./index.html")
    applicationWindow.webContents.on("did-navigate", (_: any, url: string) => {
        if (url.includes("move-request")) {
            applicationWindow.webContents.goBack();
        }
    })

    const playlistWindow = new BrowserWindow({ width: 800, height: 800, show: false })
    playlistWindow.loadURL("https://rsplaylist.com/")
    playlistWindow.webContents.on("did-navigate", () => {
        playlistWindow.webContents.executeJavaScript("document.querySelector('div.twitch-login-user').innerText").then((user: string) => {
            if (user) {
                new CyclicalPlaylistManager({ channel: user });
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