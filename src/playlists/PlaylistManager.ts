import * as puppeteer from 'puppeteer';
import fetch from 'node-fetch';

import BrowserHandler from '../puppeteer/BrowserHandler';
import selectors from '../utils/selectors';
import { RS_PLAYLIST_URL } from '../utils/constants';

import type { Playlist } from '../types';

export interface PlaylistManagerOptions {
  authenticationRefreshInterval?: number;
  playlistRefreshInterval?: number;
}

// TODO: Make class more abstract and clean
export default abstract class PlaylistManager {
  private readonly authenticationRefreshInterval: number;
  private readonly playlistRefreshInterval: number;
  private browserHandler = new BrowserHandler();
  private page: puppeteer.Page;
  private username: string;
  private playlist: Playlist = [];

  constructor(
    options: PlaylistManagerOptions = {
      authenticationRefreshInterval: 1500,
      playlistRefreshInterval: 1000,
    }
  ) {
    this.authenticationRefreshInterval = options.authenticationRefreshInterval;
    this.playlistRefreshInterval = options.playlistRefreshInterval;
    this.setup();
  }

  private async setup(): Promise<void> {
    await this.browserHandler.launchBrowser();
    this.page = await this.browserHandler.newPage();
    await this.page.goto(RS_PLAYLIST_URL);
    this.startAuthWatcherLoop();
  }

  private startAuthWatcherLoop(): void {
    const intervalId = setInterval(async () => {
      try {
        if (this.page.url() === RS_PLAYLIST_URL) {
          const isLoggedIn = await this.isLoggedIn();
          if (!isLoggedIn) {
            console.log('Please login to RS Playlist...');
          } else {
            this.username = await this.getTwitchLoginUserName();
            await this.page.goto(`${RS_PLAYLIST_URL}playlist/${this.username}`);
            this.startPlaylistWatcherLoop();
            clearInterval(intervalId);
          }
        }
      } catch {
        // Ignore
      }
    }, this.authenticationRefreshInterval);
  }

  private startPlaylistWatcherLoop(): void {
    setInterval(async () => {
      try {
        const response = await fetch(
          `${RS_PLAYLIST_URL}ajax/playlist.php?channel=${this.username}`
        );
        const text = await response.text();
        this.playlist = JSON.parse(text)['playlist'];
        this.onPlaylistUpdate(this.playlist);
      } catch (err) {
        console.log('Unable to update playlist!');
        console.error(err);
      }
    }, this.playlistRefreshInterval);
  }

  private async getTwitchUserLoginElement(): Promise<
    puppeteer.ElementHandle<Element>
  > {
    return await this.page.$(selectors.twitchLoginUserSelector);
  }

  private async isLoggedIn(): Promise<boolean> {
    return !!(await this.getTwitchUserLoginElement());
  }

  private async getTwitchLoginUserName(): Promise<string> {
    if (await this.isLoggedIn()) {
      const el = await this.page.$(selectors.twitchLoginUserNameSelector);
      const handle = await el.getProperty('textContent');
      return (await handle.jsonValue()) as string;
    }
    return undefined;
  }

  protected abstract onPlaylistUpdate(playlist: Playlist): Promise<void>;

  protected async updateSongOrder(id: number, pos: number): Promise<void> {
    await this.page.goto(
      `${RS_PLAYLIST_URL}ajax/requests.php?action=move-request&id=${id}&pos=${pos}&channel=${this.username}`
    );
  }
}
