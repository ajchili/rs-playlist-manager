import PlaylistManager from './PlaylistManager';

import type { Playlist, Song } from '../types';

type ViewerRequestStatistics = {
  lastRequestPlayed: number;
  numOfRequestsPlayed: number;
  songsInQueue: Set<number>;
};

type ViewerRequestData = Record<number, ViewerRequestStatistics>;

export default class CyclicalPlaylistManager extends PlaylistManager {
  private currentSong: Song;
  private viewerRequestData: ViewerRequestData = {};

  private get viewersWithRequests(): number[] {
    const viewersWithRequests: number[] = [];
    for (const [key, value] of Object.entries(this.viewerRequestData)) {
      if (value.songsInQueue.size) {
        viewersWithRequests.push(parseInt(key, 10));
      }
    }
    return viewersWithRequests;
  }

  private get sortedViewersWithRequests(): ViewerRequestStatistics[] {
    const statistics: ViewerRequestStatistics[] = [];
    for (const viewer of this.viewersWithRequests) {
      if (
        this.currentSong !== undefined &&
        this.currentSong.viewer.twitch_id === viewer
      ) {
        continue;
      }
      statistics.push(this.viewerRequestData[viewer]);
    }
    return statistics.sort((a, b) => {
      // If both viewers have had same number of requests played, sort by
      // request id since they are linear and allow for sorting to be done based
      // on when the request was made
      if (a.numOfRequestsPlayed === b.numOfRequestsPlayed) {
        const aFirstSongId = Array.from(a.songsInQueue.keys())[0];
        const bFirstSongId = Array.from(b.songsInQueue.keys())[0];
        return aFirstSongId - bFirstSongId;
      }
      // Sort by last played request if number of plays are not equal, we can
      // skip a comparison against the number of plays since we set
      // lastRequestPlayed to -1 during initialization
      return a.lastRequestPlayed - b.lastRequestPlayed;
    });
  }

  // TODO: make vips work lol
  protected async onPlaylistUpdate(playlist: Playlist): Promise<void> {
    this.updateCurrentSongIfNecessary(playlist);
    for (const viewer of this.viewersWithRequests) {
      // TODO: do a diff check and only remove songs that are no longer in the playlist
      this.viewerRequestData[viewer].songsInQueue.clear();
    }
    for (const song of playlist) {
      const viewer = song.viewer;
      if (!this.viewerRequestData[viewer.twitch_id]) {
        this.viewerRequestData[viewer.twitch_id] = {
          lastRequestPlayed: -1,
          numOfRequestsPlayed: 0,
          songsInQueue: new Set(),
        };
      }
      this.viewerRequestData[viewer.twitch_id].songsInQueue.add(song.id);
    }
    this.sortPlaylist();
  }

  private async sortPlaylist(): Promise<void> {
    let pos = 1;
    try {
      for (const viewerData of this.sortedViewersWithRequests) {
        // TODO: Only update on change
        const firstRequestFromViewer = Array.from(
          viewerData.songsInQueue.keys()
        )[0];
        await this.updateSongOrder(firstRequestFromViewer, pos);
        pos++;
      }
    } catch (err) {
      console.error(err);
    }
  }

  private updateCurrentSongIfNecessary(playlist: Playlist): void {
    const songIsBeingPlayed = playlist.length > 0 && playlist[0].position === 0;
    if (songIsBeingPlayed && this.currentSong === undefined) {
      this.currentSong = playlist[0];
    } else if (
      songIsBeingPlayed &&
      this.currentSong !== undefined &&
      this.currentSong.id !== playlist[0].id &&
      this.currentSong.viewer.twitch_id !== playlist[0].viewer.twitch_id
    ) {
      this.finishCurrentSong();
      this.currentSong = playlist[0];
    } else if (!songIsBeingPlayed && this.currentSong !== undefined) {
      const currentSongWasNotPlayed = !!playlist.find(
        (song) =>
          song.id === this.currentSong.id &&
          song.viewer.twitch_id === this.currentSong.viewer.twitch_id
      );
      if (currentSongWasNotPlayed) {
        this.currentSong = undefined;
      } else {
        this.finishCurrentSong();
      }
    }
  }

  private finishCurrentSong() {
    const viewer = this.currentSong.viewer;
    this.viewerRequestData[viewer.twitch_id].lastRequestPlayed =
      this.currentSong.id;
    this.viewerRequestData[viewer.twitch_id].numOfRequestsPlayed++;
    this.viewerRequestData[viewer.twitch_id].songsInQueue.delete(
      this.currentSong.id
    );
    this.currentSong = undefined;
  }
}
