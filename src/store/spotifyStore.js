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
    // any actions you want to define
  },
})
