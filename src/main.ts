import { app } from 'electron'
import ApplicationWindow from './windows/ApplicationWindow'
import RSPlaylistWindow from './windows/RSPlaylistWindow';

const createWindow = () => {
  const applicationWindow = new ApplicationWindow()
  const playlistWindow = new RSPlaylistWindow()
  playlistWindow.webContents.on("did-navigate", async () => {
    const channel = await playlistWindow.getChannel()
    if (channel) {
      playlistWindow.hide()
      applicationWindow.setChannel(channel)
      applicationWindow.show()
    }
  })
}

app.whenReady().then(() => {
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})