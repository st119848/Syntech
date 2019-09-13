let axios = require('axios')
let oauth = require('axios-oauth-client')

let token;
let expires_in;

module.exports = {
    AuthToken: () => {
        let options = {
            url: 'http://iot.senslink.net/v3/oauth2/token',
            grant_type: 'client_credentials',
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET
        };

        let now = Math.trunc(Date.now() * 0.001);

        return new Promise((resolve, reject) => {
            if (!token || expires_in < now) {
                let getClientCredentials = oauth.client(axios.create(), options);
                getClientCredentials()
                    .then((auth) => {
                        token = auth.access_token;
                        expires_in = Math.trunc((auth.expires_in * 0.8) + now);
                        resolve(token)
                    })
                    .catch((error) => {
                        reject(error)
                    })
            }
            else {
                resolve(token)
            }
        })
    }
}