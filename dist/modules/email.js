"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(constants_1.__sendgrid__);
exports.default = sgMail;
// const msg = {
//   to: 'taha@stelle.ai', // Change to your recipient
//   from: 'khaled@karine.so',
//   subject: 'Sending with SendGrid is Fun',
//   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
// }
// sgMail
//   .send(msg)
//   .then(() => {
//     console.log('Email sent')
//   })
//   .catch((error) => {
//     console.error(error)
//   })
