import axios from "axios";
import { BrowserWindow } from "electron";

import { RS_PLAYLIST_URL } from '../utils/constants';

export interface PlaylistManagerOptions {
  channel: string;
  playlistRefreshInterval?: number;
}

// TODO: Make class more abstract and clean
export default abstract class PlaylistManager {
  private manipulitableWindow = new BrowserWindow({ width: 0, height: 0, show: false })
  private readonly playlistRefreshInterval: number;
  private channel: string;
  private playlist: Playlist = [];
  private interval: NodeJS.Timer;

  constructor(
    options: PlaylistManagerOptions
  ) {
    const {
      channel,
      playlistRefreshInterval = 1000
    } = options;
    this.channel = channel
    this.playlistRefreshInterval = playlistRefreshInterval;
    this.interval = this.startPlaylistWatcherLoop();
  }

  public close() {
    this.manipulitableWindow.close();
    clearInterval(this.interval);
  }

  protected abstract onPlaylistUpdate(playlist: Playlist): Promise<void>;

  protected async updateSongOrder(id: number, pos: number): Promise<void> {
    await this.manipulitableWindow.loadURL(`${RS_PLAYLIST_URL}ajax/requests.php?action=move-request&id=${id}&pos=${pos}&channel=${this.channel}`)
  }

  private async getPlaylist(): Promise<Playlist> {
    try {
      const request = await axios.get(`${RS_PLAYLIST_URL}ajax/playlist.php?channel=${this.channel}`);
      return request.data['playlist'];
    } catch (err) {
      console.log('Unable to update playlist!');
      console.error(err);
      return [];
    }
  }

  private startPlaylistWatcherLoop(): NodeJS.Timer {
    return setInterval(async () => {
      this.playlist = await this.getPlaylist();
      this.onPlaylistUpdate(this.playlist);
    }, this.playlistRefreshInterval);
  }
}
