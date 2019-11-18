import { gql } from "apollo-server";
import { ExerciseHistory } from "./entities/exercise-history.entity";
import { Workout } from "./entities/workout.entity";
import { GraphQLResolveInfo } from "graphql";
import { getRepository, In, Raw } from "typeorm";
import { Exercise } from "./entities/exercise.entity";
import { format, isValid } from "date-fns";

export const typeDef = gql`
  extend type Query {
    getWorkouts(state: WorkoutState, userId: String, startsAt: Date): [Workout]
    getWorkout(id: ID!): Workout
  }
  extend type Mutation {
    createWorkout(
      startsAt: Date
      state: WorkoutState!
      userId: String
      name: String
      planWorkoutId: ID
      exercises: [ExerciseHistoryInput!]!
    ): Workout
    updateWorkout(
      workoutId: ID!
      startsAt: Date
      name: String
      state: WorkoutState
      exercises: [ExerciseHistoryInput!]!
    ): Workout
  }
  enum WorkoutState {
    PLANNED
    FINISHED
  }
  input ExerciseHistoryInput {
    exerciseId: ID!
    executed: JSON!
  }
  type Workout {
    id: ID!
    name: String
    startsAt: Date!
    state: WorkoutState
    note: String
    user: User
    categories: [String]
    bodyParts: [String]
    exerciseHistory: [ExerciseHistory]
  }
  type ExerciseHistory {
    id: ID!
    workout: Workout
    executed: JSON!
    exercise: Exercise
  }
`;
export const resolvers = {
  Query: {
    getWorkouts: (_, args, { user, loader }, info: GraphQLResolveInfo) => {
      if (args.startsAt && isValid(new Date(args.startsAt))) {
        const startsAt = Raw(alias => {
          const aliasWithQuote = alias
            .split(".")
            .map(v => `"${v}"`)
            .join(".");
          return `${aliasWithQuote}::date = '${format(
            new Date(args.startsAt),
            "yyyy-MM-dd"
          )}'`;
        });

        return loader.loadMany(
          Workout,
          {
            trainerId: user.trainerProfileId,
            ...(args.userId && { userId: args.userId }),
            ...(args.state && { state: args.state }),
            startsAt
          },
          info
        );
      }

      return loader.loadMany(
        Workout,
        {
          trainerId: user.trainerProfileId,
          ...(args.userId && { userId: args.userId }),
          ...(args.state && { state: args.state })
        },
        info
      );
    },
    getWorkout: (_, { id }, { loader }, info: GraphQLResolveInfo) => {
      return loader.loadOne(Workout, { id }, info);
    }
  },
  Mutation: {
    createWorkout: async (
      _,
      { name, startsAt, exercises, userId, state, planWorkoutId },
      { user }
    ) => {
      const exerciseHistoryRepository = getRepository(ExerciseHistory);
      const workoutRepository = getRepository(Workout);

      const newWorkout = await workoutRepository.save(
        workoutRepository.create({
          name,
          state,
          startsAt,
          userId,
          trainerId: user.trainerProfileId,
          parent: planWorkoutId
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
    },
    updateWorkout: async (
      _,
      { name, startsAt, exercises, workoutId, state },
      { user }
    ) => {
      const exerciseHistoryRepository = getRepository(ExerciseHistory);
      const workoutRepository = getRepository(Workout);
      await exerciseHistoryRepository.delete({ workoutId });

      const newWorkout = await workoutRepository.save(
        workoutRepository.create({
          id: workoutId,
          state: state,
          startsAt,
          name,
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
