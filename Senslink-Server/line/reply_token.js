const rp = require('request-promise');
let moment = require('moment-timezone');

const config = {
  channelAccessToken: "vYbO9GkZgdoeOM0pkORlAlA+0ml2WOviuthR/qhgmeaoXlKxTuI5H9sTXc3RA+Dm1M1k1zBjst09iwBPlnyL65BZbZd5QS9w+b62OhZz52+SBPA3PmYGeYtSzsjpNw3R0woLeICHFPnJ4FVwbUFxHgdB04t89/1O/w1cDnyilFU=",
};

const contents_before = {
    "type": "box",
    "layout": "horizontal",
    "contents": [
    {
        "type": "text",
        "text": "Before",
        "weight": "bold",
        "size": "lg",
        "color": "#555555",
        "flex": 0
    }
    ]
};

const contents_after = {
    "type": "box",
    "layout": "horizontal",
    "contents": [
    {
        "type": "text",
        "text": "After",
        "weight": "bold",
        "size": "lg",
        "color": "#555555",
        "flex": 0
    }
    ]
};

const separator = {
    "type": "separator",
    "margin": "xxl"
}

module.exports = {
    Text: function(msg) {
        const options = {
            method: 'POST',
            uri: 'https://api.line.me/v2/bot/message/broadcast',
            body: JSON.stringify({
                messages: [{
                    type: 'text',
                    text: msg
                }],
                notificationDisabled: true
            }),
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer {' + config.channelAccessToken + '}'
            },
        };

        return new Promise((resolve, reject) => {
            rp(options)
                .then((resp) => {
                    resolve(resp);
                })
                .catch((err) => {
                    reject(err);
                });
        })
    },

    Flex: function(mode, station, before, after, action_index, timestamp = moment().tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss")) {
        let contents = [];

        contents.push(contents_before);

        before.forEach((each, index) => {
            contents.push(
                {
                    "type": "box",
                    "layout": "horizontal",
                    "contents": [
                    {
                        "type": "text",
                        "text": `Gate ${action_index || index}`,
                        "size": "md",
                        "color": "#555555",
                        "flex": 0
                    },
                    {
                        "type": "text",
                        "text": `${each} cm.`,
                        "size": "md",
                        "color": "#111111",
                        "align": "end"
                    }
                    ]
                },
            )
        });

        contents.push(separator);
        contents.push(contents_after);

        after.forEach((each, index) => {
            contents.push(
                {
                    "type": "box",
                    "layout": "horizontal",
                    "contents": [
                    {
                        "type": "text",
                        "text": `Gate ${action_index || index}`,
                        "size": "md",
                        "color": "#555555",
                        "flex": 0
                    },
                    {
                        "type": "text",
                        "text": `${each} cm.`,
                        "size": "md",
                        "color": "#111111",
                        "align": "end"
                    }
                    ]
                },
            )
        });

        const options = {
            method: 'POST',
            uri: 'https://api.line.me/v2/bot/message/broadcast',
            body: {
                messages: [{
                    "type": "flex",
                    "altText": "This is a Flex Message",
                    "contents": {
                        "type": "bubble",
                        "styles": {
                            "footer": {
                            "separator": true
                            }
                        },
                        "body": {
                            "type": "box",
                            "layout": "vertical",
                            "contents": [
                            {
                                "type": "text",
                                "text": "ACTION ALERT",
                                "weight": "bold",
                                "color": "#1DB446",
                                "size": "sm"
                            },
                            {
                                "type": "text",
                                "text": mode,
                                "weight": "bold",
                                "size": "xxl",
                                "margin": "md"
                            },
                            {
                                "type": "text",
                                "text": station,
                                "size": "xs",
                                "color": "#aaaaaa",
                                "wrap": true
                            },
                            {
                                "type": "separator",
                                "margin": "xxl"
                            },
                            {
                                "type": "box",
                                "layout": "vertical",
                                "margin": "xxl",
                                "spacing": "sm",
                                "contents": contents
                            },
                            {
                                "type": "separator",
                                "margin": "xxl"
                            },
                            {
                                "type": "box",
                                "layout": "horizontal",
                                "margin": "md",
                                "contents": [
                                {
                                    "type": "text",
                                    "text": "TIMESTAMP",
                                    "size": "xs",
                                    "color": "#aaaaaa",
                                    "flex": 0
                                },
                                {
                                    "type": "text",
                                    "text": timestamp,
                                    "color": "#aaaaaa",
                                    "size": "xs",
                                    "align": "end"
                                }
                                ]
                            }
                            ]
                        }
                    },
                }]
            },
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + config.channelAccessToken
            },
            json: true
        };

        return new Promise((resolve, reject) => {
            rp(options)
                .then((resp) => {
                    resolve(resp);
                })
                .catch((err) => {
                    reject(err);
                });
        })
    },
};
