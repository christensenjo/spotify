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
        <h2>{{ trackData.name }} by {{ trackData.artists.map(artist => artist.name).join(', ') }}</h2>
        <!-- Display more track details here -->
        <div class="track-details">
          <!-- Use data from trackData to display various track details -->
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  
  export default {
    setup() {
      const route = useRoute();
      const isLoading = ref(true);
      const error = ref(null);
      const trackData = ref({});
  
    //   const fetchTrackDetails = async (id) => {
    //     try {
    //       // Replace `your_spotify_api_call` with the actual API call
    //       const response = await axios.get(`https://api.spotify.com/v1/tracks/${id}`, {
    //         headers: {
    //           'Authorization': `Bearer ${your_access_token}`, // Make sure to use the actual access token
    //         },
    //       });
    //       trackData.value = response.data;
    //     } catch (err) {
    //       error.value = err;
    //     } finally {
    //       isLoading.value = false;
    //     }
    //   };
  
      onMounted(() => {
        if (route.params.id) {
        //   fetchTrackDetails(route.params.id);
            console.log(route.params.id);
        }
      });
  
      return {
        isLoading,
        error,
        trackData,
      };
    },
  };
  </script>
  
  <style scoped>
  
  </style>
  