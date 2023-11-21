import { defineStore } from 'pinia';
import ColorThief from "colorthief";

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
    currentTrack: {},
  }),
  actions: {
    logout(){
      // 1. Clear the cookie and relevant data in the local state/store
      document.cookie = "state=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      this.code = "";
      this.state = "";
      this.accessToken = "";
      this.tokenType = "";
      this.expiresIn = 0;
      this.refreshToken = "";
      this.scope = "";
    
      // 2. Show an alert explaining that they need to revoke access via Spotify
      alert("To fully log out, you need to revoke access to this app via your Spotify account settings. You will be redirected to the Spotify account apps management page. Find joelbc-spotify on that page and click the 'Remove Access' button.");
    
      // 3. Redirect the user to the Spotify account apps management page
      window.location.href = "https://www.spotify.com/us/account/apps/";
    },
    setTopTracks(tracks){
      this.topTracks = tracks;
    },
    setCurrentTrack(track){
      this.currentTrack = track;
    },
    async getAverageColor(imageUrl){
      return new Promise((resolve, reject) => {
        const colorThief = new ColorThief();
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = imageUrl;

        img.onload = () => {
          try {
            const color = colorThief.getColor(img);
            resolve(color);
          } catch (error) {
            reject(error);
          }
        };

        img.onerror = () => {
          reject(new Error("Failed to load image"));
        };
      });
    }
  },
})
