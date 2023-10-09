"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.__app_url__ = exports.__port__ = exports.__jwt_secret__ = exports.__db_url__ = void 0;
exports.__db_url__ = process.env.DATABASE_URL;
exports.__jwt_secret__ = process.env.JWT_SECRET;
exports.__port__ = process.env.PORT;
exports.__app_url__ = process.env.APP_URL;
