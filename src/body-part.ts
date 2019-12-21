import { gql } from "apollo-server";
import { BodyPart } from "./entities/body-part.entity";
import { GraphQLResolveInfo } from "graphql";

export const typeDef = gql`
  extend type Query {
    getBodyParts: [BodyPart]
  }
  type BodyPart {
    id: ID!
    nameEn: String
    nameHu: String
  }
`;
export const resolvers = {
  Query: {
    getBodyParts: (_, __, { loader }, info: GraphQLResolveInfo) => {
      return loader.loadMany(BodyPart, {}, info);
    }
  }
};
