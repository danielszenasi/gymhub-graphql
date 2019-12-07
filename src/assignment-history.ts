import { gql } from "apollo-server";

export const typeDef = gql`
  input AssignmentHistoryInput {
    id: ID!
    executed: JSON!
  }
  type AssignmentHistory {
    id: ID!
    assignmentGroup: AssignmentGroup
    executed: JSON!
    assignment: Assignment
  }
`;
export const resolvers = {};
