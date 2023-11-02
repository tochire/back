"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
require("reflect-metadata");
const constants_1 = require("./constants");
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const User_resolver_1 = __importDefault(require("./resolvers/User.resolver"));
const Shop_Resolver_1 = __importDefault(require("./resolvers/Shop.Resolver"));
const Product_Resolver_1 = __importDefault(require("./resolvers/Product.Resolver"));
const AdminResolver_1 = __importDefault(require("./resolvers/AdminResolver"));
const Order_resolver_1 = __importDefault(require("./resolvers/Order.resolver"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const jwt_1 = require("./modules/jwt");
const body_parser_1 = __importDefault(require("body-parser"));
const main_router_1 = __importDefault(require("./routes/main.router"));
const Customer_resolver_1 = __importDefault(require("./resolvers/Customer.resolver"));
async function main() {
    await mongoose_1.default.connect(constants_1.__db_url__);
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)({
        origin: "*",
        preflightContinue: false,
    }));
    app.use(body_parser_1.default.json());
    app.use(body_parser_1.default.urlencoded({ extended: true }));
    app.use((req, _, next) => {
        if (req.headers.authorization) {
            const splitted = req.headers.authorization.split(" ");
            if (splitted[0] === "Bearer" && splitted[1]) {
                const token = splitted[1];
                const user = (0, jwt_1.verifyJWT)(token);
                if (user) {
                    req.user = user;
                }
            }
        }
        next();
    });
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: await (0, type_graphql_1.buildSchema)({
            validate: false,
            resolvers: [
                User_resolver_1.default,
                Shop_Resolver_1.default,
                Product_Resolver_1.default,
                AdminResolver_1.default,
                Order_resolver_1.default,
                Customer_resolver_1.default,
            ],
        }),
        context: ({ req, res }) => ({
            user: req.user,
            res,
        }),
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({ app });
    app.use(main_router_1.default);
    app.listen(constants_1.__port__ || 4000, () => {
        console.log(`app is listening on port ${constants_1.__port__ || 4000}`);
    });
}
main();
