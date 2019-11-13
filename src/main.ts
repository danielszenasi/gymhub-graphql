import { ApolloServer } from "apollo-server";
import typeDefs from "./schema";
import resolvers from "./resolvers";
import { createConnection } from "typeorm";
import { verify } from "jsonwebtoken";
import * as Email from "email-templates";
import * as nodemailer from "nodemailer";
import * as postmarkTransport from "nodemailer-postmark-transport";
import "reflect-metadata";
import { GraphQLDatabaseLoader } from "@mando75/typeorm-graphql-loader";

export function getUser(request: any) {
  const authorization = request.get("authorization");
  if (authorization) {
    const token = authorization.replace("Bearer ", "");
    const verifiedToken = verify(token, process.env.JWT_SECRET) as any;
    if (verifiedToken) {
      return {
        id: verifiedToken.userId,
        trainerProfileId: verifiedToken.trainerProfileId
      };
    }
  }
  return null;
}

createConnection().then(connection => {
  const context = async ({ req }) => {
    const user = getUser(req);

    const transport = nodemailer.createTransport(
      postmarkTransport({
        auth: {
          apiKey: process.env.POSTMARK_API_KEY
        }
      })
    );
    const mailer = new Email({
      message: {
        from: "no-reply@gymhub.io"
      },
      // uncomment below to send emails in development/test env:
      // send: true
      transport
    });

    return { mailer, user, loader: new GraphQLDatabaseLoader(connection) };
  };
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context
  });

  if (process.env.NODE_ENV !== "test") {
    server
      .listen({ port: process.env.PORT })
      .then(({ url }) => console.log(`🚀 app running at ${url}`));
  }
});

module.exports = {
  typeDefs,
  resolvers,
  ApolloServer
};
