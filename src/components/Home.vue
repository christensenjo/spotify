<template>
    <div class="flex flex-col items-center">
        <div class="w-3/4 mt-16">
            <ContentCard>
                <p class="text-primary">
                    <strong>Welcome to joelbc-spotify!</strong>
                    <br />
                    <br />
                    Before you log in with Spotify, we'd like to inform you about the permissions our app will request:
                    <br />
                    <br />
                    <em class="font-semibold">Access your basic account information:</em> This includes your Spotify display name and email address. We use this information to personalize your experience in our app.
                    <br />
                    <br />
                    <em class="font-semibold">View your top tracks and artists:</em> We'll analyze your listening habits and display your favorite tracks and artists in the app, so you can easily access them.
                    <br />
                    <br />
                    <em class="font-semibold">Access your playlists:</em> We'll use this permission to display your playlists and help you manage them more efficiently.
                    We take your privacy seriously and will never share your personal information with third parties. If you're comfortable with these permissions, please proceed with logging in using your Spotify account. Enjoy the joelbc-spotify experience!
                </p>
            </ContentCard>
        </div>
        <button @click="loginWithSpotify" class="w-fit text-2xl bg-secondary text-primary rounded-xl p-4 mt-8 font-medium">
            Login with Spotify
        </button>
    </div>  
</template>

<script>
    import querystring from 'querystring'

    import ContentCard from './ContentCard.vue'

    const client_id = '8c889c344b474adcae45b280704239fe'
    const redirect_uri = 'http://localhost:5173/my-music'

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
        components: {
            ContentCard
        },
        methods: {
            loginWithSpotify
        }
    }
</script>

<style scoped>

</style>