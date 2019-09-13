const nodemailer = require('nodemailer');
const util = require('util');

let mail = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    secure: false,
    auth: {
        user: "609e967353499a",
        pass: "3e11df6e3f31d2"
    }
});

module.exports = mail;