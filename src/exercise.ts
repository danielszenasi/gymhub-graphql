import { gql } from "apollo-server";
import { processUpload } from "utils";
import { getRepository, IsNull } from "typeorm";
import { Exercise } from "entities/exercise.entity";

export const typeDef = gql`
  extend type Query {
    exercises: [Exercise]
  }
  extend type Mutation {
    createExercise(
      name: String!
      instructions: String!
      measures: JSON!
      categories: JSON!
      bodyParts: JSON!
      file: Upload
    ): Exercise
  }
  input ExerciseHistoryInput {
    exerciseId: String!
    executed: JSON!
  }
  type ExerciseHistory {
    id: ID!
    executed: JSON
    exercise: Exercise
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
`;
export const resolvers = {
  Query: {
    exercises: (_, __, { user }) => {
      return getRepository(Exercise).find({
        where: [{ userId: user.id }, { userId: IsNull() }]
      });
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
  }
};
