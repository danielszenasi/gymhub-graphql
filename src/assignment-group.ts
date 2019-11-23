import { gql } from "apollo-server";
import { AssignmentHistory } from "./entities/assignment-history.entity";
import { Workout } from "./entities/workout.entity";
import { GraphQLResolveInfo } from "graphql";
import { getRepository } from "typeorm";
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
      { name, startsAt, exercises, userId, state },
      { user }: Context
    ) => {
      const assignmentHistoryRepository = getRepository(AssignmentHistory);
      const workoutRepository = getRepository(Workout);

      const newWorkout = await workoutRepository.save(
        workoutRepository.create({
          name,
          state,
          startsAt,
          userId,
          trainerId: user.trainerProfileId
        })
      );

      const exerciseEntities = exercises.map((exercise, index) =>
        assignmentHistoryRepository.create({
          executed: exercise.executed,
          assignmentId: exercise.exerciseId,
          order: index,
          assignmentGroupId: newWorkout.id
        })
      );
      const newExercises = await assignmentHistoryRepository.save(
        exerciseEntities
      );

      return { ...newWorkout, exercises: newExercises };
    },
    updateWorkout: async (
      _,
      { name, startsAt, exercises, workoutId, state },
      { user }
    ) => {
      const assignmentHistoryRepository = getRepository(AssignmentHistory);
      const workoutRepository = getRepository(Workout);
      await assignmentHistoryRepository.delete({
        assignmentGroupId: workoutId
      });

      const newWorkout = await workoutRepository.save(
        workoutRepository.create({
          id: workoutId,
          state: state,
          startsAt,
          name,
          trainerId: user.trainerProfileId
        })
      );

      const exerciseEntities = exercises.map((exercise, index) =>
        assignmentHistoryRepository.create({
          executed: exercise.executed,
          assignmentId: exercise.exerciseId,
          order: index,
          assignmentGroupId: newWorkout.id
        })
      );
      const newExercises = await assignmentHistoryRepository.save(
        exerciseEntities
      );

      return { ...newWorkout, exercises: newExercises };
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
