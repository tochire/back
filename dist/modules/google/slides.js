"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanVariables = exports.cleanString = exports.getVariablesFromSlide = exports.getVaraiblesFromString = exports.getPresentation = exports.getAllSlides = void 0;
const util_1 = require("./util");
const getAllSlides = async (user) => {
    const res = await (0, util_1.getGoogleApi)("https://www.googleapis.com/drive/v3/files?q=mimeType='application/vnd.google-apps.presentation' and trashed=false", user.googleAccount.refresh_token);
    return res.files;
};
exports.getAllSlides = getAllSlides;
const getPresentation = async (slideId, refresh_token) => await (0, util_1.getGoogleApi)(`https://slides.googleapis.com/v1/presentations/${slideId}`, refresh_token);
exports.getPresentation = getPresentation;
const getVaraiblesFromString = (str) => {
    const matches = str.matchAll(/{{( ?)+(\w+)( ?)+}}/g);
    return [...matches].map((e) => `${e[0]}`).filter((e) => e.length > 0);
};
exports.getVaraiblesFromString = getVaraiblesFromString;
const getVariablesFromSlide = async (slideId, refresh_token) => {
    const presentation = await (0, exports.getPresentation)(slideId, refresh_token);
    if (!presentation) {
        return [];
    }
    const str = JSON.stringify(presentation.slides);
    return (0, exports.getVaraiblesFromString)(str);
};
exports.getVariablesFromSlide = getVariablesFromSlide;
const cleanString = (str) => str.replace('{{', '').replace('}}', '').trim();
exports.cleanString = cleanString;
const cleanVariables = (strs) => strs
    .map(exports.cleanString)
    .sort()
    .filter((e, i, arr) => i === 0 || e !== arr[i - 1]);
exports.cleanVariables = cleanVariables;
