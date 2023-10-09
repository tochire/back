"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagStatus = exports.TaskStatus = exports.Priority = void 0;
var Priority;
(function (Priority) {
    Priority["Neutral"] = "Neutral";
    Priority["Low"] = "Low";
    Priority["Medium"] = "Medium";
    Priority["High"] = "High";
})(Priority = exports.Priority || (exports.Priority = {}));
var TaskStatus;
(function (TaskStatus) {
    TaskStatus["active"] = "active";
    TaskStatus["completed"] = "completed";
    TaskStatus["archived"] = "archived";
    TaskStatus["deleted"] = "deleted";
})(TaskStatus = exports.TaskStatus || (exports.TaskStatus = {}));
var TagStatus;
(function (TagStatus) {
    TagStatus["active"] = "active";
    TagStatus["archived"] = "archived";
})(TagStatus = exports.TagStatus || (exports.TagStatus = {}));
