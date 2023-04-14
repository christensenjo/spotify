<template>
    <div class="titleCard">
        <p>Details about permissions, etc</p>
        <button @click="loginWithSpotify" class="text-2xl bg-secondary text-primary rounded-xl p-4 font-medium">Login with Spotify</button>
    </div>
</template>

<script>
    import querystring from 'querystring'
    const client_id = '8c889c344b474adcae45b280704239fe'
    import { client_secret } from './secrets';
    const redirect_uri = 'http://localhost:5173/loggedIn'

    const generateRandomString = function(length) {
        var text = ''
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

        for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length))
        }
        return text
    }

    const loginWithSpotify = async function(event) {
        if (event) {
            let state = generateRandomString(16)
            document.cookie = "state=" + state;
            const scope = [
                "user-read-private",
                "user-read-email",
                "user-top-read",
                ].join(" ");

            console.log('logging in');

            // Get code and state via authorize endpoint
            location.assign('https://accounts.spotify.com/authorize?' 
                + querystring.stringify({
                    response_type: 'code',
                    client_id: client_id,
                    scope: scope,
                    redirect_uri: redirect_uri,
                    state
                }))

            return '200'
        }

    }

    export default {
        data() {
            return {
                name: 'Login'
            }
        },
        methods: {
            loginWithSpotify
        }
    }
</script>

<style scoped>

</style>