import { gql } from "apollo-server";
import { GraphQLResolveInfo } from "graphql";
import { Category } from "./entities/category.entity";

export const typeDef = gql`
  extend type Query {
    getCategories: [BodyPart]
  }
  type Category {
    id: ID!
    nameEn: String
    nameHu: String
  }
`;
export const resolvers = {
  Query: {
    getCategories: (_, __, { loader }, info: GraphQLResolveInfo) => {
      return loader.loadMany(Category, {}, info);
    }
  }
};
