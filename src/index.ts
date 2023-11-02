import { config } from "dotenv";
config();

import "reflect-metadata";
import { __db_url__, __jwt_secret__, __port__ } from "./constants";
import express, { Response } from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import UserResolver from "./resolvers/User.resolver";
import ShopResolver from "./resolvers/Shop.Resolver";
import ProductResolver from "./resolvers/Product.Resolver";
import AdminResolver from "./resolvers/AdminResolver";
import OrderResolver from "./resolvers/Order.resolver";
import mongoose from "mongoose";
import cors from "cors";
import { verifyJWT } from "./modules/jwt";
import bodyParser from "body-parser";
import { MyRequest } from "./types";
import { User } from "./models/User/User";
import mainRouter from "./routes/main.router";
import CustomerResolver from "./resolvers/Customer.resolver";

async function main() {
  await mongoose.connect(__db_url__);

  const app = express();

  app.use(
    cors({
      origin: "*",
      preflightContinue: false,
    })
  );

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use((req: MyRequest, _, next) => {
    if (req.headers.authorization) {
      const splitted = req.headers.authorization.split(" ");
      if (splitted[0] === "Bearer" && splitted[1]) {
        const token = splitted[1];
        const user = verifyJWT(token) as User;
        if (user) {
          req.user = user;
        }
      }
    }
    next();
  });

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      validate: false,
      resolvers: [
        UserResolver,
        ShopResolver,
        ProductResolver,
        AdminResolver,
        OrderResolver,
        CustomerResolver,
      ],
    }),
    context: ({ req, res }: { req: MyRequest; res: Response }) => ({
      user: req.user,
      res,
    }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });
  app.use(mainRouter);

  app.listen(__port__ || 4000, () => {
    console.log(`app is listening on port ${__port__ || 4000}`);
  });
}

main();
