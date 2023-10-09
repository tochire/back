"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = require("../../models/User/User");
const router = (0, express_1.Router)();
router.post("/", async (req, res) => {
    // @ts-ignore
    if (req.user) {
        // @ts-ignore
        const { id } = req.user;
        if (id) {
            const user = await User_1.User.findOne({ _id: id });
            const playerIds = [
                ...(user.playerIds || []).filter((e) => e !== req.body.playerId),
            ];
            if (req.body.status === true || req.body.status === undefined) {
                playerIds.push(req.body.playerId);
            }
            user.playerIds = playerIds;
            await user.save();
        }
    }
    res.send();
});
exports.default = router;
