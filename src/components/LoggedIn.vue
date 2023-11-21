<template>
  <div class="p-8 rounded-md flex flex-col justify-center text-center items-center">
    
    <div v-if="!isLoading && tracksToDisplay && tracksToDisplay.length > 0">
      <h1 class="font-black text-4xl pb-8 mb-6">Top Tracks</h1>

      <div v-for="item in tracksToDisplay" 
        :key="item.id"
        class="flex flex-row justify-around items-center my-4 py-6 rounded-lg max-w-md mx-auto cursor-pointer"
        :style="albumGradientStyle(item)"
        @click="openTrackAnalysis(item)"
      >
        <!-- Album Cover -->
        <!-- :href="item.external_urls?.spotify" links to the track in spotify -->
        <a class="w-1/3 flex justify-center">
          <img  
            :src="item.album.images[0] ? item.album.images[0]?.url : ''" 
            :alt="item?.name" 
            class="w-fit items-center ml-8" 
          />
        </a>
        <!-- Title by Artist -->
        <div class="w-1/2 flex flex-col items-center">
          <p>{{ item?.name }}</p>
          <p>by</p>
          <p v-for="artist in item.artists">
            {{ artist?.name }}
          </p>
        </div>
      </div>
    </div>
    <div v-else>
      <img src="../assets/logo.png" class="w-64 p-2 animate-spin">
    </div>

  </div>
</template>

<script>
import axios from "axios";
import querystring from "querystring";
import { client_secret } from "./secrets";
import { useSpotifyStore } from "@/store/spotifyStore.js";
import { onMounted, computed } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";

const client_id = "8c889c344b474adcae45b280704239fe";
const redirect_uri = "http://localhost:5173/my-music";

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
    const isLoading = ref(true);
    const router = useRouter();

    const fetchTopTracks = async () => {
      try {
        isLoading.value = true;
        const response = await axios.get("https://api.spotify.com/v1/me/top/tracks", {
          headers: {
            "Authorization": `${spotifyStore.tokenType} ${spotifyStore.accessToken}`,
          },
        });

        await Promise.all(response.data.items.map(item => {
          return spotifyStore.getAverageColor(item.album.images[0].url).then(color => {
            item.averageColor = color;
          });
        }));

        spotifyStore.setTopTracks(response.data);
        isLoading.value = false;
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

    const albumGradientStyle = (item) => {    
      if (!item.averageColor) return ''; // Return an empty string if no color is available
      // Assuming item.averageColor is an array of RGB values like [r, g, b]
      return `background-image: linear-gradient(to bottom, rgba(${item.averageColor[0]}, ${item.averageColor[1]}, ${item.averageColor[2]}, 1), #222326)`;
    };

    const openTrackAnalysis = (item) => {
      spotifyStore.setCurrentTrack(item);
      router.push({ name: 'TrackAnalysis', params: { id: item.id } });
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
        window.history.replaceState({}, "", "/my-music");

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
      fetchTopTracks,
      tracksToDisplay,
      albumGradientStyle,
      isLoading,
      openTrackAnalysis,
      // Explicitly return only the properties and methods you need
      accessToken: spotifyStore.accessToken,
      tokenType: spotifyStore.tokenType,
      expiresIn: spotifyStore.expiresIn,
      refreshToken: spotifyStore.refreshToken,
      scope: spotifyStore.scope,
    };

  },
};
</script>

<style scoped>

</style>
