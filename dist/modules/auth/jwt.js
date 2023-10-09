"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJWT = exports.getJWT = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const constants_1 = require("../../constants");
const getJWT = (user) => (0, jsonwebtoken_1.sign)({
    id: user.id,
}, constants_1.__jwt_secret__);
exports.getJWT = getJWT;
const verifyJWT = (token) => {
    try {
        return (0, jsonwebtoken_1.verify)(token, constants_1.__jwt_secret__, { algorithms: ['HS256'] });
    }
    catch (err) {
        return null;
    }
};
exports.verifyJWT = verifyJWT;
