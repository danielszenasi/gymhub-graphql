import { ApolloServer, gql } from "apollo-server";
import { createConnection } from "typeorm";
import { verify } from "jsonwebtoken";
import * as Email from "email-templates";
import * as nodemailer from "nodemailer";
import * as postmarkTransport from "nodemailer-postmark-transport";
import "reflect-metadata";
import { GraphQLDatabaseLoader } from "@mando75/typeorm-graphql-loader";
import resolvers from "./resolvers";
import { typeDef as User, resolvers as userResolvers } from "./user";
import {
  typeDef as Exercise,
  resolvers as exerciseResolvers
} from "./assignment";
import {
  typeDef as AssignmentHistory,
  resolvers as assignmentHistoryResolvers
} from "./assignment-history";
import {
  typeDef as AssignmentGroup,
  resolvers as assignmentGroupResolvers
} from "./assignment-group";
import {
  typeDef as WorkoutPlan,
  resolvers as workoutPlanResolvers
} from "./workout-plan";

import { merge } from "lodash";
import { AssignmentGroupService } from "./services/assignment-group.service";

export interface Context {
  mailer: Email;
  user: {
    id: string;
    trainerProfileId: string;
  };
  loader: GraphQLDatabaseLoader;
  assignmentGroupService: AssignmentGroupService;
}

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

const Scalar = gql`
  scalar JSON
  scalar Date
`;

const Query = gql`
  type Query {
    _empty: String
  }
`;

const Mutation = gql`
  type Mutation {
    _empty: String
  }
`;

createConnection().then(connection => {
  const context = async ({ req }): Promise<Context> => {
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
      // send: true,
      transport
    });

    return {
      mailer,
      user,
      loader: new GraphQLDatabaseLoader(connection),
      assignmentGroupService: new AssignmentGroupService()
    };
  };

  const server = new ApolloServer({
    typeDefs: [
      Scalar,
      Query,
      Mutation,
      User,
      Exercise,
      AssignmentGroup,
      AssignmentHistory,
      WorkoutPlan
    ],
    resolvers: merge(
      resolvers,
      userResolvers,
      exerciseResolvers,
      assignmentGroupResolvers,
      assignmentHistoryResolvers,
      workoutPlanResolvers
    ),
    context,
    introspection: true,
    playground: true
  });

  if (process.env.NODE_ENV !== "test") {
    server
      .listen({ port: process.env.PORT })
      .then(({ url }) => console.log(`🚀 app running at ${url}`));
  }
});

module.exports = {
  resolvers,
  ApolloServer
};
