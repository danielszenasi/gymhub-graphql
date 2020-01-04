import { gql } from "apollo-server";
import { Workout } from "./entities/workout.entity";
import { GraphQLResolveInfo } from "graphql";
import { Context } from "./main";
import { Statistics } from "./entities/statistics.entity";
import { getRepository, IsNull } from "typeorm";

export const typeDef = gql`
  extend type Query {
    getWorkouts(
      type: WorkoutType
      userId: String
      startsAt: Date
      days: Int
      skipTodo: Int
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
      nameEn: String
      nameHu: String
      planWorkoutId: ID
      exercises: [AssignmentHistoryInput!]!
    ): AssignmentGroup
    updateWorkout(
      workoutId: ID!
      startsAt: Date
      nameEn: String
      nameHu: String
      state: WorkoutState
      exercises: [AssignmentHistoryInput!]!
    ): AssignmentGroup
    deleteStatistics(id: String!): AssignmentGroup
    deleteWorkout(id: String!): AssignmentGroup
    createStatistics(
      startsAt: Date
      state: WorkoutState!
      userId: String
      nameEn: String
      nameHu: String
      measurements: [AssignmentHistoryInput!]!
    ): AssignmentGroup
    updateStatistics(
      statisticsId: ID!
      startsAt: Date
      nameEn: String
      nameHu: String
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
    nameEn: String
    nameHu: String
    startsAt: Date
    state: WorkoutState
    noteEn: String
    noteHu: String
    user: User
    categories: [Category]
    bodyParts: [BodyPart]
    assignmentHistories: [AssignmentHistory]
  }
`;
export const resolvers = {
  Query: {
    getWorkouts: async (
      _,
      args,
      { user, loader, assignmentGroupService },
      info: GraphQLResolveInfo
    ) => {
      const criteria = assignmentGroupService.getCriteria(args, user);
      const workouts = await loader.loadMany(Workout, criteria, info, {
        order: {
          '"Workout"."startsAt"': "DESC"
        }
      });

      if (args.startsAt && args.days && workouts.length < 4) {
        const limit = 4 - workouts.length;
        const fromToken = user.trainerProfileId
          ? { trainerId: user.trainerProfileId }
          : { userId: user.id };
        const [todos] = await loader.loadManyPaginated(
          Workout,
          {
            ...fromToken,
            startsAt: IsNull(),
            deletedAt: IsNull()
          },
          info,
          { limit, offset: args.skipTodo },
          {
            order: {
              '"Workout"."order"': "ASC"
            }
          }
        );

        return [...workouts, ...todos];
      }

      return workouts;
    },
    getWorkout: (_, { id }) => {
      const repository = getRepository(Workout);
      return repository
        .createQueryBuilder("workout")
        .leftJoinAndSelect("workout.assignmentHistories", "assignmentHistories")
        .leftJoinAndSelect("assignmentHistories.assignment", "assignment")
        .leftJoinAndSelect("assignment.categories", "categories")
        .leftJoinAndSelect("assignment.bodyParts", "bodyParts")
        .leftJoinAndSelect("assignment.measures", "measures")
        .leftJoinAndSelect("assignmentHistories.executions", "executions")
        .leftJoinAndSelect("executions.measure", "measure")
        .where({ id })
        .getOne();
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
    deleteWorkout: async (_, { id }, { assignmentGroupService }: Context) => {
      return assignmentGroupService.deleteWorkout(id);
    },
    createStatistics: async (
      _,
      args,
      { user, assignmentGroupService }: Context
    ) => {
      return assignmentGroupService.saveStatistics(args, user);
    },
    deleteStatistics: async (
      _,
      { id },
      { assignmentGroupService }: Context
    ) => {
      return assignmentGroupService.deleteStatistics(id);
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
      { assignmentGroupService }: Context
    ) => {
      return assignmentGroupService.getCategories(workout.id);
    },
    bodyParts: async (
      workout: Workout,
      _,
      { assignmentGroupService }: Context
    ) => {
      return assignmentGroupService.getBodyParts(workout.id);
    }
  }
};
