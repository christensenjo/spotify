<template>
  <div class="track-analysis-container">
    <h1>Track Analysis</h1>
    <div v-if="isLoading">
      <p>Loading track analysis...</p>
    </div>
    <div v-else-if="error">
      <p>An error occurred: {{ error.message }}</p>
    </div>
    <div v-else>
      <!-- Displaying Track name, artist name, etc -->
      <div class="w-1/2 flex flex-col items-center">
          <h2>{{ track.name }}</h2>
          <p>by</p>
          <p v-for="artist in artists">
            {{ artist }}
          </p>
        </div>
      <div class="track-details">
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
      const track = ref({});

      const fetchTrack = async (id) => {
        try{
          const response = await axios.get('https://api.spotify.com/v1/tracks/' + id, {
            headers: {
              "Authorization": `${spotifyStore.tokenType} ${spotifyStore.accessToken}`,
            },
          });
          track.value = response.data;
          console.log('track: ', track.value);
        } catch (err) {
          error.value = err;
        } finally {
          isLoading.value = false;
        }
      };

      const fetchTrackAnalysis = async (id) => {
        try{
          const response = await axios.get('https://api.spotify.com/v1/audio-analysis/' + id, {
            headers: {
              "Authorization": `${spotifyStore.tokenType} ${spotifyStore.accessToken}`,
            },
          });
          trackAnalysis.value = response.data;
          console.log(trackAnalysis.value);
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
        return track.value.artists?.map(artist => artist.name) ?? [];
      });
  
      onMounted(() => {
        if (route.params.id) {
            fetchTrack(route.params.id);
            fetchTrackAnalysis(route.params.id);
        }
      });
  
      return {
        isLoading,
        error,
        track,
        trackAnalysis,
        fetchTrack,
        fetchTrackAnalysis,
        getKey,
        formatDuration,
        artists,
      };
    },
  };
  </script>
  
  <style scoped>
  
  </style>
  