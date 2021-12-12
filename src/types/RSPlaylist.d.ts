declare type Playlist = Song[];

declare type Song = {
  id: number;
  vip: boolean;
  position: number;
  string: string; // title
  tags: unknown[];
  request_timestamp: number;
  viewer: Viewer;
  dlc_set: DLC[];
};

declare type Viewer = {
  username: string;
  twitch_id: number;
  badges: string[];
  present: boolean;
  inactive: boolean;
  inactive_time: number;
};

declare type DLC = {
  id: number;
  cdlc_id: number;
  artist: string;
  artist_id: number;
  title: string;
  album: string;
  tuning: number;
  parts: unknown;
  dd: boolean;
  official: number;
  creator: string;
  estimated_length: number;
  trr_url: unknown;
  updated: number;
  downloads: number;
  tuning_name: string;
  paths: number;
  paths_string: string;
};
