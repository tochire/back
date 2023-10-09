"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const logger_1 = __importDefault(require("../../modules/logger"));
const user_1 = require("../../modules/auth/user");
const constants_1 = require("../../constants");
const auth_1 = require("../../modules/google/auth");
const jwt_1 = require("../../modules/auth/jwt");
const router = (0, express_1.Router)();
router.get('/callback', async (req, res) => {
    const { code, state } = req.query;
    try {
        if (!code) {
            return res.redirect(constants_1.__app_url__);
        }
        const { refresh_token, scope, access_token } = await (0, auth_1.getGoogleAuth)(code);
        let user = await (0, user_1.findOrCreateUser)(refresh_token, access_token, state);
        if (refresh_token) {
            user.googleAccount = {
                refresh_token,
                scope,
            };
            await user.save();
        }
        const token = (0, jwt_1.getJWT)(user);
        return res.redirect(`${constants_1.__app_url__}?token=${token}`);
    }
    catch (err) {
        if (err.response && err.response.status) {
            logger_1.default.error('Error in drive callback Query: ' +
                JSON.stringify(req.query) +
                'Status:' +
                err.response.status +
                ' / Data:' +
                JSON.stringify(err.response.data));
        }
        else {
            logger_1.default.error(err);
        }
        return res.redirect(constants_1.__app_url__);
    }
});
const SCOPES = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/presentations',
    'https://www.googleapis.com/auth/documents',
    'https://www.googleapis.com/auth/drive.readonly',
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/spreadsheets',
];
router.get('/link/:id', async (req, res) => {
    res.redirect('https://accounts.google.com/o/oauth2/v2/auth?'.concat('client_id=', constants_1.__google_client_id__, '&access_type=offline', '&response_type=code', '&prompt=select_account', '&state=', req.params.id, '&scope=', SCOPES.join(' '), '&redirect_uri=', constants_1.__google_redirect_url__, '/v1/integrations/google/callback'));
});
router.get('/link', async (req, res) => {
    res.redirect('https://accounts.google.com/o/oauth2/v2/auth?'.concat('client_id=', constants_1.__google_client_id__, '&access_type=offline', '&response_type=code', '&prompt=select_account', '&scope=', SCOPES.join(' '), '&redirect_uri=', constants_1.__google_redirect_url__, '/v1/integrations/google/callback'));
});
exports.default = router;
