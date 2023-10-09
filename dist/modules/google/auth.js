"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserInfo = exports.getTokenFromRefreshToken = exports.getGoogleAuth = void 0;
const axios_1 = __importDefault(require("axios"));
const constants_1 = require("../../constants");
const util_1 = require("./util");
const getGoogleAuth = async (code) => {
    const { data: { refresh_token, scope, access_token }, } = await axios_1.default.post('https://oauth2.googleapis.com/token', {
        code,
        client_id: constants_1.__google_client_id__,
        client_secret: constants_1.__google_client_secret__,
        redirect_uri: constants_1.__google_redirect_url__ + '/v1/integrations/google/callback',
        grant_type: 'authorization_code',
    });
    return {
        refresh_token,
        scope,
        access_token,
    };
};
exports.getGoogleAuth = getGoogleAuth;
async function getTokenFromRefreshToken(refreshToken) {
    return (await axios_1.default.post(`https://oauth2.googleapis.com/token?client_id=${constants_1.__google_client_id__}&client_secret=${constants_1.__google_client_secret__}&refresh_token=${refreshToken}&grant_type=refresh_token`)).data.access_token;
}
exports.getTokenFromRefreshToken = getTokenFromRefreshToken;
async function getUserInfo(refreshToken, access_token) {
    try {
        return await (0, util_1.getGoogleApi)(`https://www.googleapis.com/oauth2/v1/userinfo`, refreshToken, access_token);
    }
    catch (err) {
        console.log(err.response.data);
    }
}
exports.getUserInfo = getUserInfo;
