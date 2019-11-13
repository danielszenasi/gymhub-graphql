const { gql } = require("apollo-server");

const typeDefs = gql`
  scalar JSON
  scalar Date
  type Query {
    me: User
    clients: [User]
    exercises: [Exercise]
    workouts(userId: String): [Workout]
  }
  type Mutation {
    login(email: String!, password: String!): AuthPayload
    signup(
      email: String!
      password: String!
      firstName: String
      lastName: String
      isTrainer: Boolean
    ): AuthPayload
    inviteUser(email: String!): User
    signupByInvite(
      email: String!
      inviteToken: String!
      password: String!
      firstName: String
      lastName: String
    ): AuthPayload
    createExercise(
      name: String!
      instructions: String!
      measures: JSON!
      categories: JSON!
      bodyParts: JSON!
      file: Upload
    ): Exercise
    createWorkout(
      startsAt: Date!
      userId: String
      exercises: [ExerciseHistoryInput!]!
    ): Workout
  }
  input ExerciseHistoryInput {
    exerciseId: String!
    executed: JSON!
  }
  type User {
    id: ID!
    email: String!
    inviteAccepted: Boolean!
    firstName: String
    lastName: String
  }
  type Workout {
    id: ID!
    startsAt: Date!
    note: String
    user: User
    categories: [String]
    bodyParts: [String]
  }
  type ExerciseHistory {
    id: ID!
    executed: JSON
    exercise: Exercise
  }
  type AuthPayload {
    token: String!
    user: User
  }
  type UserIdPayload {
    id: String!
  }
  type Exercise {
    id: ID!
    name: String!
    instructions: String!
    url: String!
    measures: JSON!
    categories: JSON!
    bodyParts: JSON!
  }
  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }
`;
export default typeDefs;
