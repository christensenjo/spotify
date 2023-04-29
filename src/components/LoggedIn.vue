<template>
  <div class="p-8 rounded-md flex flex-col justify-center text-center items-center">
    
    <div v-if="tracksToDisplay.length > 0">
      <h1 class="font-black text-4xl pb-8 mb-6">Top Tracks</h1>

      <div v-for="item in tracksToDisplay" 
        :key="item.id"
        class="flex flex-row justify-around items-center my-4 py-6 rounded-lg max-w-md mx-auto"
        :style="`background-image: linear-gradient(to bottom, rgb(${item.averageColor[0]},${item.averageColor[1]},${item.averageColor[2]}), #222326)`"

      >
        <a :href="item.external_urls.spotify" class="w-1/3 flex justify-center">
          <img  
            :src="item.album.images[0].url" 
            :alt="item.name" 
            class="w-fit items-center ml-8" 
          />
        </a>
        <div class="w-1/2 flex flex-col items-center">
          <p class="">{{ item.name }}</p>
          <p>by</p><p v-for="artist in item.artists">{{ artist.name }}</p>
        </div>
      </div>
    </div>
    <div v-else>

    </div>

  </div>
</template>

<script>
import axios from "axios";
import querystring from "querystring";
import { client_secret } from "./secrets";
import { useSpotifyStore } from "@/store/spotifyStore.js";
import { onMounted, computed } from "vue";
import ColorThief from "colorthief";

const client_id = "8c889c344b474adcae45b280704239fe";
const redirect_uri = "http://localhost:5173/loggedIn";

function getCookie(cname) {
  const name = cname + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

export default {
  setup() {
    const spotifyStore = useSpotifyStore();

    const fetchTopTracks = async () => {
      try {
        const response = await axios.get("https://api.spotify.com/v1/me/top/tracks", {
          headers: {
            "Authorization": `${spotifyStore.tokenType} ${spotifyStore.accessToken}`,
          },
        });

        if (response.data) {
          spotifyStore.topTracks = response.data;

          for (const item of spotifyStore.topTracks.items) {
            item.averageColor = await getAverageColor(item.album.images[0].url);
          }

          console.log(spotifyStore.topTracks.items);
        }
      } catch (error) {
        console.error("Error fetching top tracks:", error);
      }
    };


    const tracksToDisplay = computed (() => {
      if(spotifyStore.topTracks 
        && spotifyStore.topTracks.items
        && spotifyStore.topTracks.items.length > 0)
      {
        return spotifyStore.topTracks.items;
      }else{
        return [];
      }      
    });

    const getAverageColor = async (imageUrl) => {
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
    };

    onMounted(async () => {
      if(window.location.href.split("?").length >= 2) {
        const href = window.location.href.split("?")[1].split("&");
        spotifyStore.code = href[0].split("=")[1];
        spotifyStore.state = href[1].split("=")[1];

        const correctState = getCookie("state") === spotifyStore.state;
        if (!correctState) {
          alert("The state was incorrect. Aborting authorization attempt.");
          window.location.href = "https://open.spotify.com/";
          return;
        }
      }

      try {
        const response = await axios.post(
          "http://localhost:5173/api/token",
          querystring.stringify({
            code: spotifyStore.code,
            redirect_uri,
            client_id,
            client_secret,
            grant_type: "authorization_code",
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );

        // Clean up the URL
        window.history.replaceState({}, "", "/loggedIn");

        if (response.data) {
          spotifyStore.accessToken = response.data.access_token;
          spotifyStore.tokenType = response.data.token_type;
          spotifyStore.expiresIn = response.data.expires_in;
          spotifyStore.refreshToken = response.data.refresh_token;
          spotifyStore.scope = response.data.scope;
        }

        if(spotifyStore.topTracks.length === 0){
          fetchTopTracks();
        }else{
          console.log('length not 0');
          console.log(spotifyStore.topTracks);
        }

      } catch (error) {
        console.error("Error getting token:", error);
      }
    });

    return {
      ...spotifyStore,
      fetchTopTracks,
      tracksToDisplay,
    };
  },
};
</script>

<style scoped>

</style>
