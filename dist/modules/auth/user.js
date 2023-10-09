"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findOrCreateUser = exports.createUserAndLogin = exports.login = exports.createUser = void 0;
const User_1 = require("../../models/User/User");
const password_1 = require("./password");
const jwt_1 = require("./jwt");
const auth_1 = require("../google/auth");
// * important if you ever come across any of these functions and you wanna refactor them, please do.
const insertUser = async (user) => new User_1.User(user).save();
async function createUser(user) {
    const { hash, salt } = await (0, password_1.getHashPassword)(user.password);
    return await insertUser({ ...user, password: hash, salt });
}
exports.createUser = createUser;
async function login(email, password) {
    const user = await User_1.User.findOne({ email });
    if (!user) {
        return {
            errors: [
                {
                    code: 'Unauthorized',
                    msg: 'Wrong email or password',
                },
            ],
        };
    }
    if (!user.password) {
        return {
            errors: [
                {
                    code: 'Unauthorized',
                    msg: 'Can only log in through google. Reset your password to have a password.',
                },
            ],
        };
    }
    const isValidPassword = await (0, password_1.validatePassword)(password, user.password);
    if (isValidPassword) {
        return {
            user,
            token: (0, jwt_1.getJWT)(user),
        };
    }
    return {
        errors: [
            {
                code: 'Unauthorized',
                msg: 'Wrong email or password',
            },
        ],
    };
}
exports.login = login;
async function createUserAndLogin(user) {
    const createdUser = await createUser(user);
    return {
        token: (0, jwt_1.getJWT)(createdUser),
        user: createdUser,
    };
}
exports.createUserAndLogin = createUserAndLogin;
const findOrCreateUser = async (refresh_token, access_token, id) => {
    let user = await User_1.User.findOne({
        _id: id,
    });
    if (!user) {
        if (refresh_token || access_token) {
            const googleUser = await (0, auth_1.getUserInfo)(refresh_token, access_token);
            user = await User_1.User.findOne({
                email: googleUser.email,
            });
            if (!user) {
                user = new User_1.User({
                    email: googleUser.email,
                    firstName: googleUser.given_name,
                    lastName: googleUser.family_name,
                    locale: googleUser.locale,
                    isAgreeingToTermsOfService: true,
                });
            }
        }
    }
    return user;
};
exports.findOrCreateUser = findOrCreateUser;
