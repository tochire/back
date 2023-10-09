"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const password_1 = require("../password");
const bcrypt_1 = require("bcrypt");
describe("Password", () => {
    it("getHashPassword tests", async () => {
        const returned = await (0, password_1.getHashPassword)("password");
        expect((0, bcrypt_1.compareSync)("password", returned.hash)).toBe(true);
        expect((0, bcrypt_1.compareSync)("passwosrd", returned.hash)).toBe(false);
    });
});
