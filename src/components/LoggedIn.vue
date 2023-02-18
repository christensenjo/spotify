<script>
    import querystring from 'querystring'
    const client_id = '8c889c344b474adcae45b280704239fe'
    import client_secret from './secrets'
    const redirect_uri = 'http://127.0.0.1:5173/loggedIn'
    let code = null
    let state = null

    const getCookie = function(cname) {
        let name = cname + "="
        let decodedCookie = decodeURIComponent(document.cookie)
        let ca = decodedCookie.split(';')
        for(let i = 0; i <ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
            c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length)
            }
        }
        return ""
    }

    export default {
        data() {
            return {
                name: 'LoggedIn',
            }
        },
        mounted(){
            // Get results of /authorize call
            let href = location.href.split('?')[1].split('&')
            code = href[0].split('=')[1]
            state = href[1].split('=')[1]
            // console.log(code)
            // console.log(state)

            //Check state...
            let correctState = getCookie("state") == state
            // console.log(correctState)
            if(!correctState){
                alert("The state was incorrect. Aborting authorization attempt.")
                location.href = "https://open.spotify.com/"
                return null
            }

            // Create /token payload
            var details = {
                'code': 'code',
                'redirect_uri': redirect_uri,
                'grant_type': 'authorization_code'
            };

            var formBody = [];
            for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
            }
            formBody = formBody.join("&");

            // Call /token
            let tokenResponse = fetch('https://accounts.spotify.com/api/token', 
                {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Authorization': 'Basic ' + (client_id + ':' + client_secret).toString('base64'),
                        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                    },
                    body: formBody
                })
            .then((response) => response.json())
            .then((data) => {
                //handle response data
                console.log(data)
                alert(data)
            })

            console.log(tokenResponse)
        }
    }

</script>

<template>
    <div class="titleCard">
        <h1>attempting login...</h1>
        <p>details</p>
    </div>
</template>

<style scoped>
    h1 {
        font-weight: 900;
        font-size: 40px;
    }
</style>