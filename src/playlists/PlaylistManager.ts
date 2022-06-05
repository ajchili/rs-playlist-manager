import axios from "axios";

import { RS_PLAYLIST_URL } from '../utils/constants';

export interface PlaylistManagerOptions {
  channel: string;
  playlistRefreshInterval?: number;
}

// TODO: Make class more abstract and clean
export default abstract class PlaylistManager {
  private readonly playlistRefreshInterval: number;
  private channel: string;
  private playlist: Playlist = [];

  constructor(
    options: PlaylistManagerOptions
  ) {
    const {
      channel,
      playlistRefreshInterval = 1000
    } = options;
    this.channel = channel
    this.playlistRefreshInterval = playlistRefreshInterval;
    this.startPlaylistWatcherLoop();
  }

  private async getPlaylist(): Promise<Playlist> {
    try {
      const response = await fetch(
        `${RS_PLAYLIST_URL}ajax/playlist.php?channel=${this.channel}`
      );
      const text = await response.text();
      return JSON.parse(text)['playlist'];
    } catch (err) {
      console.log('Unable to update playlist!');
      console.error(err);
      return [];
    }
  }

  private startPlaylistWatcherLoop(): void {
    setInterval(async () => {
      this.playlist = await this.getPlaylist();
      this.onPlaylistUpdate(this.playlist);
    }, this.playlistRefreshInterval);
  }

  protected abstract onPlaylistUpdate(playlist: Playlist): Promise<void>;

  protected async updateSongOrder(id: number, pos: number): Promise<void> {
    // await this.page.goto(
    //   `${RS_PLAYLIST_URL}ajax/requests.php?action=move-request&id=${id}&pos=${pos}&channel=${this.username}`
    // );
  }
}
