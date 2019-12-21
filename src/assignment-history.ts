import { gql } from "apollo-server";

export const typeDef = gql`
  input AssignmentHistoryInput {
    id: ID!
    executed: [ExecutionInput]
  }
  input ExecutionInput {
    value: Float
    measureId: String!
  }
  type AssignmentHistory {
    id: ID!
    assignmentGroup: AssignmentGroup
    executions: [Execution]
    assignment: Assignment
  }
  type Execution {
    value: Float
    measure: Measure
  }
`;
export const resolvers = {};
