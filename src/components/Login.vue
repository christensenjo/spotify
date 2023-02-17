<script>
    import querystring from 'querystring'
    const client_id = '8c889c344b474adcae45b280704239fe'
    import client_secret from './secrets'
    const redirect_uri = 'http://127.0.0.1:5173/loggedIn'

    let code = null
    let state = null

    const generateRandomString = function(length) {
        var text = ''
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

        for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length))
        }
        return text
    }

    const getCookie = function(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for(let i = 0; i <ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
            c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    const loginWithSpotify = async function(event) {
        if (event) {
            let state = generateRandomString(16)
            document.cookie = "state=" + state;
            let scope = 'user-read-private user-read-email'

            // Get code and state via authorize endpoint
            location.assign('https://accounts.spotify.com/authorize?' 
                + querystring.stringify({
                    response_type: 'code',
                    client_id: client_id,
                    scope: scope,
                    redirect_uri: redirect_uri,
                    state
                }))

            code = querystring.parse().code
            state = querystring.parse().state

            return code, state
        }
        
        // Request refresh and access tokens after checking state
        
        //Check state...
        let storedState = getCookie("state")
        console.log(storedState)
        if(storedState == state){
            alert("asdflasta")
            return null
        }

        // let authOptions = {
        //     url: 'https://accounts.spotify.com/api/token',
        //     form: {
        //         code: code,
        //         redirect_uri: redirect_uri,
        //         grant_type: 'authorization_code'
        //     },
        //     headers: {
        //         'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
        //     },
        //     json: true
        // };

        // let tokenResponse = await fetch(authOptions)
        // .t;

        let tokenResponse = await fetch('https://accounts.spotify.com/api/token', 
            {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "code": code,
                    "redirect_uri": redirect_uri,
                    "grant_type": 'authorization_code'
                })
            })
        .then((response) => response.json())
        .then((data) => {
            //handle response data
            console.log(data)
            alert(data)
        })

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

<template>
    <div class="titleCard">
        <p>Details about permissions, etc</p>
        <button @click="loginWithSpotify">Login with Spotify</button>
    </div>
</template>

<style scoped>
    button {
        font-weight: 500;
        font-size: 25px;
        fill: green;
    }
</style>