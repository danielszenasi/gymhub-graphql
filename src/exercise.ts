import { gql } from "apollo-server";
import { processUpload } from "./utils";
import { getRepository, IsNull, In } from "typeorm";
import { Exercise } from "./entities/exercise.entity";
import { ExerciseHistory } from "./entities/exercise-history.entity";

export const typeDef = gql`
  extend type Query {
    getExercises(ids: [String]): [Exercise]
    getExercise(id: ID!): Exercise
  }
  extend type Mutation {
    createExercise(
      name: String!
      instructions: String!
      measures: [String]!
      categories: [String]!
      bodyParts: [String]!
      file: Upload
    ): Exercise
  }
  type Exercise {
    id: ID!
    name: String!
    instructions: String!
    url: String!
    measures: JSON!
    categories: JSON!
    bodyParts: JSON!
    history(userId: ID): [ExerciseHistory]
  }
`;
export const resolvers = {
  Query: {
    getExercises: (_, { ids }, { user, loader }, info) => {
      return loader.loadMany(
        Exercise,
        [
          { userId: user.id, ...(ids && { id: In(ids) }) },
          { userId: IsNull(), ...(ids && { id: In(ids) }) }
        ],
        info
      );
    },
    getExercise: (_, { id }, { loader }, info) => {
      return loader.loadOne(Exercise, { id }, info);
    }
  },
  Mutation: {
    createExercise: async (
      _,
      { name, instructions, measures, categories, bodyParts, file },
      { user }
    ) => {
      const url = await processUpload(file);
      const exerciseRepository = getRepository(Exercise);
      const newExercise = await exerciseRepository.save({
        name,
        instructions,
        measures: measures,
        categories: categories,
        bodyParts: bodyParts,
        url,
        userId: user ? user.id : null
      });
      return newExercise;
    }
  },
  Exercise: {
    history: (exercise: Exercise, { userId }) => {
      return getRepository(ExerciseHistory)
        .createQueryBuilder("exerciseHistory")
        .innerJoinAndSelect("exerciseHistory.workout", "workout")
        .where("exerciseHistory.exerciseId = :exerciseId", {
          exerciseId: exercise.id
        })
        .andWhere("workout.userId = :userId", { userId })
        .getMany();
    }
  }
};
