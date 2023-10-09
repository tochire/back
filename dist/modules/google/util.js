"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGoogleApi = exports.postGoogleApi = void 0;
const axios_1 = __importDefault(require("axios"));
const auth_1 = require("./auth");
const postGoogleApi = async (url, body, refresh_token, headers) => {
    const token = await (0, auth_1.getTokenFromRefreshToken)(refresh_token);
    const res = await axios_1.default.post(url, body, {
        headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json',
            ...(headers ? headers : {}),
        },
    });
    return res.data;
};
exports.postGoogleApi = postGoogleApi;
const getGoogleApi = async (url, refresh_token, access_token, headers) => {
    let token = '';
    if (access_token) {
        token = access_token;
    }
    else {
        token = await (0, auth_1.getTokenFromRefreshToken)(refresh_token);
    }
    const res = await axios_1.default.get(url, {
        headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json',
            ...(headers ? headers : {}),
        },
    });
    return res.data;
};
exports.getGoogleApi = getGoogleApi;
