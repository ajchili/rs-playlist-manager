import PlaylistManager from './PlaylistManager';
import { PriorityQueue } from '../utils/PriorityQueue';

type ViewerRequestStatistics = {
  lastRequestPlayed: number;
  numOfRequestsPlayed: number;
  songsInQueue: PriorityQueue<Song>;
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
      const aNextSong = a.songsInQueue.peek();
      const bNextSong = b.songsInQueue.peek();
      // If one viewer has a VIP but the other does not, prioritize the viewer
      // with a VIP request.
      if (aNextSong.vip && !bNextSong.vip) {
        return -1;
      }
      if (!aNextSong.vip && bNextSong.vip) {
        return 1;
      }
      // If both viewers have had same number of requests played, sort by
      // request id since they are linear and allow for sorting to be done based
      // on when the request was made.
      if (a.numOfRequestsPlayed === b.numOfRequestsPlayed) {
        return aNextSong.id - bNextSong.id;
      }
      // Sort by last played request if number of plays are not equal, we can
      // skip a comparison against the number of plays since we set
      // lastRequestPlayed to -1 during initialization. VIP status can also be
      // ignored because at this point both viewers have the same VIP status.
      return a.lastRequestPlayed - b.lastRequestPlayed;
    });
  }

  protected async onPlaylistUpdate(playlist: Playlist): Promise<void> {
    this.updateCurrentSongIfNecessary(playlist);
    this.updateViewerData(playlist);
    this.sortPlaylist(playlist);
  }

  private async sortPlaylist(playlist: Playlist): Promise<void> {
    let pos = 1;
    try {
      for (const viewerData of this.sortedViewersWithRequests) {
        const expectedPosition = (this.currentSong ? 0 : -1) + pos;
        const firstRequestFromViewer = viewerData.songsInQueue.peek();
        if (playlist[expectedPosition].id !== firstRequestFromViewer.id) {
          await this.updateSongOrder(firstRequestFromViewer.id, pos);
        }
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

  private updateViewerData(playlist: Playlist): void {
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
          songsInQueue: new PriorityQueue<Song>(),
        };
      }
      const priority = song.vip ? 1 : 0;
      this.viewerRequestData[viewer.twitch_id].songsInQueue.insert(
        song,
        priority
      );
    }
  }

  private finishCurrentSong() {
    const viewer = this.currentSong.viewer;
    this.viewerRequestData[viewer.twitch_id].lastRequestPlayed =
      this.currentSong.id;
    this.viewerRequestData[viewer.twitch_id].numOfRequestsPlayed++;
    this.viewerRequestData[viewer.twitch_id].songsInQueue.pop();
    this.currentSong = undefined;
  }
}
