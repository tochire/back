"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHashPassword = exports.validatePassword = void 0;
const bcrypt_1 = require("bcrypt");
const __num_rounds__ = 12;
async function generateSalt() {
    return new Promise((resolve, reject) => {
        (0, bcrypt_1.genSalt)(__num_rounds__, (err, salt) => {
            if (err) {
                return reject(err);
            }
            return resolve(salt);
        });
    });
}
async function hashPassword(pass, salt) {
    return new Promise((resolve, reject) => {
        (0, bcrypt_1.hash)(pass, __num_rounds__, (err, hash) => {
            if (err) {
                return reject(err);
            }
            return resolve({ hash, salt });
        });
    });
}
async function validatePassword(pass, dbPass) {
    return new Promise((resolve, reject) => {
        (0, bcrypt_1.compare)(pass, dbPass, (err, isValidPassword) => {
            if (err) {
                return reject(err);
            }
            return resolve(isValidPassword);
        });
    });
}
exports.validatePassword = validatePassword;
async function getHashPassword(password) {
    const salt = await generateSalt();
    return await hashPassword(password, salt);
}
exports.getHashPassword = getHashPassword;
