<template>
  <div v-if="isLoading" class="flex justify-center items-center">
    <img src="../assets/logo.png" class="w-64 p-2 animate-spin">
  </div>
  <div v-else-if="error">
    <p>An error occurred: {{ error.message }}</p>
  </div>
  <div v-else 
    class="flex flex-col justify-start items-center mt-12 gap-6 rounded-lg p-8"
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
    <div>
      <!-- Displaying more track details -->
      <p><strong>Duration:</strong> {{ formatDuration(trackAnalysis.track?.duration) }}</p>
      <p><strong>Loudness:</strong> {{ trackAnalysis.track?.loudness ?? '' }} dB</p>
      <p><strong>Tempo:</strong> {{ trackAnalysis.track?.tempo ?? '' }} BPM</p>
      <p><strong>Key:</strong> {{ getKey(trackAnalysis.track?.key) }}</p>
      <p><strong>Mode:</strong> {{ trackAnalysis.track?.mode == 1 ? 'Major' : 'Minor' }}</p>
      <p><strong>Time Signature:</strong> {{ trackAnalysis.track?.time_signature }}/4</p>
      <!-- Add other details as needed -->
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
  