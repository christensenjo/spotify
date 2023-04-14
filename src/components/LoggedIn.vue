<script>
import axios from "axios";
import querystring from "querystring";
import { client_secret } from "./secrets";

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
  data() {
    return {
      name: "LoggedIn",
      accessToken: "",
      tokenType: "",
      expiresIn: "",
      refreshToken: "",
      scope: "",
      topTracks: [],
    };
  },
  async mounted() {
    const href = window.location.href.split("?")[1].split("&");
    const code = href[0].split("=")[1];
    const state = href[1].split("=")[1];

    const correctState = getCookie("state") === state;
    if (!correctState) {
      alert("The state was incorrect. Aborting authorization attempt.");
      window.location.href = "https://open.spotify.com/";
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5173/api/token",
        querystring.stringify({
          code,
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

      if (response.data) {
        this.accessToken = response.data.access_token;
        this.tokenType = response.data.token_type;
        this.expiresIn = response.data.expires_in;
        this.refreshToken = response.data.refresh_token;
        this.scope = response.data.scope;
      }

      this.fetchTopTracks();

    } catch (error) {
      console.error("Error getting token:", error);
    }
  },
  methods: {
    async fetchTopTracks() {
      try {
        const response = await axios.get("https://api.spotify.com/v1/me/top/tracks", {
          headers: {
            "Authorization": `${this.tokenType} ${this.accessToken}`,
          },
        });
        
        if (response.data) {
          this.topTracks = response.data;
          console.log(this.topTracks);
        }
      } catch (error) {
        console.error("Error fetching top tracks:", error);
      }
    },
  },
};
</script>

<template>
  <div class="titleCard">
    <h1>Logged in</h1>
    <p>Access Token: {{ accessToken }}</p>
    <p>Token Type: {{ tokenType }}</p>
    <p>Expires In: {{ expiresIn }}</p>
    <p>Refresh Token: {{ refreshToken }}</p>
    <p>Scope: {{ scope }}</p>
  </div>
</template>

<style scoped>
  h1 {
    font-weight: 900;
    font-size: 40px;
  }
</style>
