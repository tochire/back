"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.post("/", (req, res) => {
    const docRequest = req.body;
    return res.json(docRequest);
});
exports.default = router;
