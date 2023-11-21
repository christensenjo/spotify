<template>
  <div v-if="isLoading" class="flex justify-center items-center">
    <img src="../assets/logo.png" class="w-64 p-2 animate-spin">
  </div>
  <div v-else-if="error">
    <p>An error occurred: {{ error.message }}</p>
  </div>
  <div v-else 
    class="flex flex-col justify-start items-center mt-12 gap-6 rounded-lg p-8 w-full"
    :style="gradientStyle"
  >
    <div class="flex justify-center items-center gap-8">
      <img
        :src="track.album.images[0].url ??  ''" 
        :alt="track.name" 
        class="w-1/4 items-center ml-8" 
      />
      <div class="text-center">
        <h1 class="font-black text-4xl mb-1 underline decoration-[#1db954]">{{ track.name }}</h1>
        <p class="text-2xl">by</p>
        <p v-for="artist in artists" class="text-2xl font-semibold">
          {{ artist }}
        </p>
      </div>
    </div>
    <div class="flex flex-wrap text-primary gap-1 justify-center">
      <!-- Displaying more track details -->
      <div class="bg-white border-2 rounded-lg w-1/3 p-4 flex justify-around">
        <div class="flex flex-col justify-center text-center">
          <p class="text-2xl font-bold">Duration</p>
          <p>{{ formatDuration(trackAnalysis.track?.duration) }}</p>
        </div>
        <img src="../assets/duration.png" class="w-20 p-2"/>
      </div>
      <div class="bg-white border-2 rounded-lg w-1/3 p-4 px-6 flex justify-around">
        <div class="flex flex-col justify-center text-center">
          <p class="text-2xl font-bold">Loudness</p>
          <p>{{ trackAnalysis.track?.loudness ?? '' }} dB</p>
        </div>
        <img src="../assets/loudness.png" class="w-20 p-2"/>
      </div>
      <div class="bg-white border-2 rounded-lg w-1/3 p-4 flex justify-around">
        <div class="flex flex-col justify-center text-center">
          <p class="text-2xl font-bold">Tempo</p>
          <p>{{ trackAnalysis.track?.tempo ?? '' }} BPM</p>
        </div>
        <img src="../assets/tempo.png" class="w-20 p-2"/>
      </div>
      <div class="bg-white border-2 rounded-lg w-1/3 p-4 flex justify-around">
        <div class="flex flex-col justify-center text-center">
          <p class="text-2xl font-bold">Key</p>
          <p>{{ getKey(trackAnalysis.track?.key) }}</p>
        </div>
        <img src="../assets/music_notes_2.png" class="w-20 p-2"/>
      </div>
      <div class="bg-white border-2 rounded-lg w-1/3 p-4 flex justify-around">
        <div class="flex flex-col justify-center text-center">
          <p class="text-2xl font-bold">Mode</p>
          <p>{{ trackAnalysis.track?.mode == 1 ? 'Major' : 'Minor' }}</p>
        </div>
        <img src="../assets/sheet_music.png" class="w-20 p-2"/>
      </div>
      <div class="bg-white border-2 rounded-lg w-1/3 p-4 flex justify-around">
        <div class="flex flex-col justify-center text-center">
          <p class="text-2xl font-bold">Time Signature</p>
          <p>{{ trackAnalysis.track?.time_signature }}/4</p>
        </div>
        <img src="../assets/time_signature.png" class="w-20 p-2"/>
      </div>
    </div>
  </div>
</template>
  
  <script>
  import axios from 'axios';
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { useSpotifyStore } from "@/store/spotifyStore.js";
  import { computed } from 'vue';
  
  export default {
    setup() {
      const route = useRoute();
      const spotifyStore = useSpotifyStore();
      const isLoading = ref(true);
      const error = ref(null);
      const trackAnalysis = ref({});

      // const fetchTrack = async (id) => {
      //   try{
      //     const response = await axios.get('https://api.spotify.com/v1/tracks/' + id, {
      //       headers: {
      //         "Authorization": `${spotifyStore.tokenType} ${spotifyStore.accessToken}`,
      //       },
      //     });
      //     track.value = response.data;
      //     console.log('track: ', track.value);
      //   } catch (err) {
      //     error.value = err;
      //   } finally {
      //     isLoading.value = false;
      //   }
      // };

      const fetchTrackAnalysis = async (id) => {
        try{
          const response = await axios.get('https://api.spotify.com/v1/audio-analysis/' + id, {
            headers: {
              "Authorization": `${spotifyStore.tokenType} ${spotifyStore.accessToken}`,
            },
          });
          trackAnalysis.value = response.data;
          console.log('analysis: ', trackAnalysis.value);
        } catch (err) {
          error.value = err;
        } finally {
          isLoading.value = false;
        }
      };

      const getKey = (keyCode) => {
        // Convert key code to musical key name
        const keys = ['C', 'C♯/D♭', 'D', 'D♯/E♭', 'E', 'F', 'F♯/G♭', 'G', 'G♯/A♭', 'A', 'A♯/B♭', 'B'];
        return keys[keyCode] || 'Unknown';
      };

      const formatDuration = (duration) => {;
        const minutes = Math.floor(duration / 60);
        const seconds = Math.round(duration % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
      };

      const artists = computed(() => {
        return spotifyStore.currentTrack.artists?.map(artist => artist.name) ?? [];
      });

      const track = computed(() => spotifyStore.currentTrack ?? {});

      const gradientStyle = computed(() => { 
        return spotifyStore?.currentAlbumGradientStyle
      });
      
      onMounted(() => {
        if (route.params.id) {
            fetchTrackAnalysis(route.params.id);
        }

        console.log('topTracks: ', spotifyStore.topTracks);
      });
  
      return {
        isLoading,
        error,
        trackAnalysis,
        fetchTrackAnalysis,
        getKey,
        formatDuration,
        artists,
        track,
        gradientStyle,
      };
    },
  };
  </script>
  
  <style scoped>
  
  </style>
  