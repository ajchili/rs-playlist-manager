import { app } from 'electron'
import ApplicationWindow from './windows/ApplicationWindow'
import RSPlaylistWindow from './windows/RSPlaylistWindow';

const createWindow = () => {
    const applicationWindow = new ApplicationWindow()
    const playlistWindow = new RSPlaylistWindow()
    playlistWindow.webContents.on("did-navigate", () => {
        playlistWindow.webContents.executeJavaScript("document.querySelector('div.twitch-login-user').innerText").then((user: string) => {
            if (user) {
                playlistWindow.close()
                applicationWindow.setChannel(user)
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