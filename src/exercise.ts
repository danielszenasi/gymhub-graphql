import { gql } from "apollo-server";
import { processUpload } from "./utils";
import { getRepository, IsNull, In } from "typeorm";
import { Exercise } from "./entities/exercise.entity";
import { AssignmentHistory } from "./entities/assignment-history.entity";

export const typeDef = gql`
  extend type Query {
    getExercises(ids: [String]): [Exercise]
    getExercise(id: ID!): Exercise
  }
  extend type Mutation {
    createExercise(
      name: String!
      description: String!
      measures: [String]!
      categories: [String]!
      bodyParts: [String]!
      file: Upload!
    ): Exercise
  }
  type Exercise {
    id: ID!
    name: String!
    description: String!
    url: String!
    measures: JSON!
    categories: JSON!
    bodyParts: JSON!
    history(userId: ID): [AssignmentHistory]
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
      { name, description, measures, categories, bodyParts, file },
      { user }
    ) => {
      const url = file ? await processUpload(file) : null;

      const exerciseRepository = getRepository(Exercise);
      const newExercise = await exerciseRepository.save({
        name,
        description,
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
      return getRepository(AssignmentHistory)
        .createQueryBuilder("i")
        .innerJoinAndSelect("i.assignmentGroup", "assignmentGroup")
        .where("i.assignmentId = :assignmentId", {
          assignmentId: exercise.id
        })
        .andWhere("assignmentGroup.userId = :userId", { userId })
        .getMany();
    }
  }
};
