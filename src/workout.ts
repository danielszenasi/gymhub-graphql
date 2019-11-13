import { gql } from "apollo-server";
import { ExerciseHistory } from "./entities/exercise-history.entity";
import { Workout } from "./entities/workout.entity";
import { GraphQLResolveInfo } from "graphql";
import { getRepository, In } from "typeorm";
import { Exercise } from "./entities/exercise.entity";

export const typeDef = gql`
  extend type Query {
    workouts(userId: String): [Workout]
    getWorkout(id: String!): Workout
  }
  extend type Mutation {
    createWorkout(
      startsAt: Date!
      userId: String
      exercises: [ExerciseHistoryInput!]!
    ): Workout
  }
  input ExerciseHistoryInput {
    id: ID!
    exerciseId: String!
    executed: JSON!
  }
  type Workout {
    id: ID!
    startsAt: Date!
    note: String
    user: User
    categories: [String]
    bodyParts: [String]
    exerciseHistory: [ExerciseHistory]
  }
  type ExerciseHistory {
    id: ID!
    executed: JSON!
    exercise: Exercise
  }
`;
export const resolvers = {
  Query: {
    workouts: (_, args, { user }) => {
      return getRepository(Workout).find({
        where: [
          {
            trainerId: user.trainerProfileId,
            ...(args.userId && { userId: args.userId })
          }
        ],
        relations: ["user"]
      });
    },
    getWorkout: (_, { id }, { loader }, info: GraphQLResolveInfo) => {
      return loader.loadOne(Workout, { id }, info);
    }
  },
  Mutation: {
    createWorkout: async (_, { startsAt, exercises, userId }, { user }) => {
      const exerciseHistoryRepository = getRepository(ExerciseHistory);
      const workoutRepository = getRepository(Workout);

      const newWorkout = await workoutRepository.save(
        workoutRepository.create({
          startsAt,
          userId,
          trainerId: user.trainerProfileId
        })
      );

      const exerciseEntities = exercises.map(exercise =>
        exerciseHistoryRepository.create({
          ...exercise,
          workoutId: newWorkout.id
        })
      );
      const newExercises = await exerciseHistoryRepository.save(
        exerciseEntities
      );

      return { ...newWorkout, exercises: newExercises };
    }
  },
  Workout: {
    categories: async (
      parent: Workout,
      _,
      context: any,
      info: GraphQLResolveInfo
    ) => {
      const exerciseHistories = await context.loader.loadMany(
        ExerciseHistory,
        {
          workoutId: parent
        },
        info,
        { requiredSelectFields: ["exerciseId"] }
      );
      const ids = exerciseHistories.map(
        exerciseHistories => exerciseHistories.exerciseId
      );
      const uniqueIds = new Set(ids);

      const exercises = await context.loader.loadMany(
        Exercise,
        {
          id: In(Array.from(uniqueIds))
        },
        info,
        { requiredSelectFields: ["id", "categories", "bodyParts"] }
      );

      return Array.from(
        exercises.reduce((set, exercise) => {
          exercise.categories.forEach(category => set.add(category));
          return set;
        }, new Set())
      );
    },
    bodyParts: async (
      parent: Workout,
      _,
      context: any,
      info: GraphQLResolveInfo
    ) => {
      const exerciseHistories = await context.loader.loadMany(
        ExerciseHistory,
        {
          workoutId: parent
        },
        info,
        { requiredSelectFields: ["exerciseId"] }
      );
      const ids = exerciseHistories.map(
        exerciseHistories => exerciseHistories.exerciseId
      );
      const uniqueIds = new Set(ids);

      const exercises = await context.loader.loadMany(
        Exercise,
        {
          id: In(Array.from(uniqueIds))
        },
        info,
        { requiredSelectFields: ["id", "categories", "bodyParts"] }
      );

      return Array.from(
        exercises.reduce((set, exercise) => {
          exercise.bodyParts.forEach(bodyPart => set.add(bodyPart));
          return set;
        }, new Set())
      );
    }
  }
};
