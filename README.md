# rs-playlist-manager

The RS Playlist Manager is a NodeJS application that was built to automatically sort viewer requests to reduce strain on streamers and their moderators.

## Limitations

- This application **requires [NodeJS](https://nodejs.org/en/)**.
- This application is a work in progress, thus **there may be unexpected behaviors and errors**.
- This application is **semi-automated**.
  - Every launch requires authentication. See instructions below to avoid needing to sign into Twitch.
- This application is **not user friendly**.
- This application **only has a single method of sorting playlists**.
- This application is **not optimized**.

### Avoiding authentication on launch

**This grants this application full control over your personal chrome, this includes extensions, passwords, history, and all other browser features/functionality. Use this functionality at your own risk.**

1. Launch chrome with the remote debugger enabled (example commands below)
   - Mac OS: `/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222`
   - Windows: `C:\Program Files (x86)\Google\Chrome\Application\chrome.exe --remote-debugging-port=9222`
   - If the above commands do not work, navigate `chrome://version` to get the executable path then append
1. Copy the link which chrome outputs (e.g. `ws://127.0.0.1:9222/devtools/browser/90427eee-2680-4ff6-a3f7-c81908439484`)
1. Start `rs-playlist-manager`
   - `CHROME_REMOTE_DEBUGGER_URL=YOUR_URL npm run dev`

## How to use

1. Download [NodeJS](https://nodejs.org/en/).
2. Clone the repository.
3. Run `npm install`.
4. Run `npm run dev`.
5. Authenticate via Twitch.
6. Sit back and relax (so long as the application does not crash).
