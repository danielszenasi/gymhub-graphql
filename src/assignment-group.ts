import { gql } from "apollo-server";
import { Workout } from "./entities/workout.entity";
import { GraphQLResolveInfo } from "graphql";
import { Context } from "./main";
import { Statistics } from "./entities/statistics.entity";

export const typeDef = gql`
  extend type Query {
    getWorkouts(
      type: WorkoutType
      userId: String
      startsAt: Date
    ): [AssignmentGroup]
    getWorkout(id: ID!): AssignmentGroup
    getStatistics(
      type: WorkoutType
      userId: String
      startsAt: Date
    ): [AssignmentGroup]
    getStatistic(id: ID!): AssignmentGroup
  }
  extend type Mutation {
    createWorkout(
      startsAt: Date
      state: WorkoutState!
      userId: String
      name: String
      planWorkoutId: ID
      exercises: [AssignmentHistoryInput!]!
    ): AssignmentGroup
    updateWorkout(
      workoutId: ID!
      startsAt: Date
      name: String
      state: WorkoutState
      exercises: [AssignmentHistoryInput!]!
    ): AssignmentGroup
    createStatistics(
      startsAt: Date
      state: WorkoutState!
      userId: String
      name: String
      measurements: [AssignmentHistoryInput!]!
    ): AssignmentGroup
    updateStatistics(
      statisticsId: ID!
      startsAt: Date
      name: String
      state: WorkoutState
      measurements: [AssignmentHistoryInput!]!
    ): AssignmentGroup
    attachWorkoutToUser(userId: ID!, workoutId: ID!): [AssignmentGroup]
    attachStatisticsToUser(userId: ID!, statisticsId: ID!): [AssignmentGroup]
  }
  enum WorkoutType {
    GLOBAL
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
    },
    getStatistic: (_, { id }, { loader }, info: GraphQLResolveInfo) => {
      return loader.loadOne(Statistics, { id }, info);
    },
    getStatistics: (
      _,
      args,
      { user, loader, assignmentGroupService },
      info: GraphQLResolveInfo
    ) => {
      const criteria = assignmentGroupService.getCriteria(args, user);
      return loader.loadMany(Statistics, criteria, info);
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
    },
    updateStatistics: async (_, args, { user, assignmentGroupService }) => {
      return assignmentGroupService.updateStatistics(args, user);
    },
    attachWorkoutToUser: async (_, args, { user, assignmentGroupService }) => {
      return assignmentGroupService.attachWorkout(args, user);
    },
    attachStatisticsToUser: async (
      _,
      args,
      { user, assignmentGroupService }
    ) => {
      return assignmentGroupService.attachStatistics(args, user);
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
