import { gql } from "apollo-server";
import { GraphQLResolveInfo } from "graphql";
import { Measure } from "./entities/measure.entity";

export const typeDef = gql`
  extend type Query {
    getMeasures: [Measure]
  }
  type Measure {
    id: ID!
    nameEn: String
    nameHu: String
    accurancy: Int
  }
`;
export const resolvers = {
  Query: {
    getMeasures: (_, __, { loader }, info: GraphQLResolveInfo) => {
      return loader.loadMany(Measure, {}, info);
    }
  }
};
