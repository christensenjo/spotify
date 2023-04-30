import { defineStore } from 'pinia'

export const useSpotifyStore = defineStore({
  id: 'spotify',
  state: () => ({
    accessToken: '',
    tokenType: '',
    expiresIn: '',
    refreshToken: '',
    scope: '',
    topTracks: [],
    code: '',
    state: '',
  }),
  actions: {
    logout(){
      // 1. Clear the cookie and relevant data in the local state/store
      document.cookie = "state=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      spotifyStore.code = "";
      spotifyStore.state = "";
      spotifyStore.accessToken = "";
      spotifyStore.tokenType = "";
      spotifyStore.expiresIn = 0;
      spotifyStore.refreshToken = "";
      spotifyStore.scope = "";

      // 2. Show an alert explaining that they need to revoke access via Spotify
      alert("To fully log out, you need to revoke access to this app via your Spotify account settings. You will be redirected to the Spotify account apps management page. Find joelbc-spotify on that page and click the 'Remove Access' button.");

      // 3. Redirect the user to the Spotify account apps management page
      window.location.href = "https://www.spotify.com/us/account/apps/";
    },
  },
})
