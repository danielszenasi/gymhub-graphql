import { gql } from "apollo-server";
import { Workout } from "./entities/workout.entity";
import { GraphQLResolveInfo } from "graphql";
import { Context } from "./main";

export const typeDef = gql`
  extend type Query {
    getWorkouts(
      type: WorkoutType
      userId: String
      startsAt: Date
    ): [AssignmentGroup]
    getWorkout(id: ID!): AssignmentGroup
  }
  extend type Mutation {
    createWorkout(
      startsAt: Date
      state: WorkoutState!
      userId: String
      name: String
      planWorkoutId: ID
      exercises: [ExerciseHistoryInput!]!
    ): AssignmentGroup
    updateWorkout(
      workoutId: ID!
      startsAt: Date
      name: String
      state: WorkoutState
      exercises: [ExerciseHistoryInput!]!
    ): AssignmentGroup
    createStatistics(
      startsAt: Date!
      userId: String
      name: String!
      measurements: [MeasurementHistoryInput!]!
    ): AssignmentGroup
  }
  enum WorkoutType {
    COMMON
    PLANNED
    FINISHED
  }
  enum WorkoutState {
    PLANNED
    FINISHED
  }

  type AssignmentGroup {
    id: ID!
    name: String
    startsAt: Date
    state: WorkoutState
    note: String
    user: User
    categories: [String]
    bodyParts: [String]
    assignmentHistories: [AssignmentHistory]
  }
`;
export const resolvers = {
  Query: {
    getWorkouts: (
      _,
      args,
      { user, loader, assignmentGroupService },
      info: GraphQLResolveInfo
    ) => {
      const criteria = assignmentGroupService.getCriteria(args, user);
      return loader.loadMany(Workout, criteria, info);
    },
    getWorkout: (_, { id }, { loader }, info: GraphQLResolveInfo) => {
      return loader.loadOne(Workout, { id }, info);
    }
  },
  Mutation: {
    createWorkout: async (
      _,
      args,
      { user, assignmentGroupService }: Context
    ) => {
      return assignmentGroupService.saveWorkout(args, user);
    },
    createStatistics: async (
      _,
      args,
      { user, assignmentGroupService }: Context
    ) => {
      return assignmentGroupService.saveStatistics(args, user);
    },
    updateWorkout: async (_, args, { user, assignmentGroupService }) => {
      return assignmentGroupService.updateWorkout(args, user);
    }
  },
  AssignmentGroup: {
    categories: async (
      workout: Workout,
      _,
      { assignmentGroupService, loader }: Context,
      info: GraphQLResolveInfo
    ) => {
      return assignmentGroupService.getCategories(loader, workout.id, info);
    },
    bodyParts: async (
      workout: Workout,
      _,
      { assignmentGroupService, loader }: Context,
      info: GraphQLResolveInfo
    ) => {
      return assignmentGroupService.getBodyParts(loader, workout.id, info);
    }
  }
};
