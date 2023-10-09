"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJWT = exports.verifyJWT = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const constants_1 = require("../constants");
const verifyJWT = (token) => {
    try {
        return (0, jsonwebtoken_1.verify)(token, constants_1.__jwt_secret__, { algorithms: ['HS256'] });
    }
    catch (err) {
        return null;
    }
};
exports.verifyJWT = verifyJWT;
const getJWT = (user) => (0, jsonwebtoken_1.sign)({
    id: user.id,
}, constants_1.__jwt_secret__, { algorithm: 'HS256' });
exports.getJWT = getJWT;
