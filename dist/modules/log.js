"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logAction = void 0;
const Log_1 = require("../models/Log/Log");
const logAction = async (loggerId, shopId, action, time) => {
    const log = new Log_1.Log({ loggerId, shopId, action, time });
    await log.save();
};
exports.logAction = logAction;
