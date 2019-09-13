const axios = require("axios");
const http = require('http');
const https = require('https');

module.exports = {
    GetApiData: (url, token) => {
        const instance = axios.create({
            baseURL: 'https://iot.senslink.net/v3/api',
            httpAgent: new http.Agent({ 
                keepAlive: true,
                rejectUnauthorized: false 
            }),
            httpsAgent: new https.Agent({ 
                keepAlive: true,
                rejectUnauthorized: false 
            }),
            withCredentials: true,
            headers: { 
                Authorization: "Bearer " + token,
                Accept: '*/*',
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            },
            timeout: 10000
        })

        instance.interceptors.response.use((response) => {
            return response.data;
        }, (error) => {
            return Promise.reject(error);
        });

        return new Promise((resolve, reject) => {
            instance.get(url)
                .then(resp => {
                    resolve(resp)
                })
                .catch(err => {
                    reject(err);
                })
        })
    }
}
