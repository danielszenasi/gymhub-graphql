import GraphQLJSON from "graphql-type-json";
import { GraphQLUpload } from "graphql-upload";
import { GraphQLScalarType, Kind } from "graphql";

const resolvers = {
  Upload: GraphQLUpload,
  JSON: GraphQLJSON,
  Date: new GraphQLScalarType({
    name: "Date",
    description: "Date custom scalar type",
    parseValue(value) {
      return new Date(value); // value from the client
    },
    serialize(value) {
      return value; // value sent to the client
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.INT) {
        return parseInt(ast.value, 10);
      }
      if (ast.kind === Kind.STRING) {
        return ast.value;
      }
      return null;
    }
  })
};

export default resolvers;
