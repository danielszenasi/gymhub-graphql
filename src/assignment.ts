import { gql } from "apollo-server";
import { processUpload } from "./utils";
import { getRepository, In } from "typeorm";
import { Exercise } from "./entities/exercise.entity";
import { AssignmentHistory } from "./entities/assignment-history.entity";
import { Measurement } from "./entities/measurement.entity";

export const typeDef = gql`
  extend type Query {
    getExercises(ids: [String]): [Assignment]
    getExercise(id: ID!): Assignment
    getMeasurements(ids: [String]): [Assignment]
    getMeasurement(id: ID!): Assignment
  }
  extend type Mutation {
    createExercise(
      name: String!
      description: String!
      measures: [String]!
      categories: [String]!
      bodyParts: [String]!
      file: Upload!
    ): Assignment
    createMeasurement(
      name: String!
      description: String
      measures: [String]!
      categories: [String]!
      bodyParts: [String]
    ): Assignment
  }
  type Assignment {
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
      const criteria = user ? { userId: user.id } : { isPublic: true };
      return loader.loadMany(
        Exercise,
        [{ ...criteria, ...(ids && { id: In(ids) }) }],
        info
      );
    },
    getExercise: (_, { id }, { loader }, info) => {
      return loader.loadOne(Exercise, { id }, info);
    },
    getMeasurements: (_, { ids }, { user, loader }, info) => {
      const criteria = user ? { userId: user.id } : { isPublic: true };

      return loader.loadMany(
        Measurement,
        [{ ...criteria, ...(ids && { id: In(ids) }) }],
        info
      );
    },
    getMeasurement: (_, { id }, { loader }, info) => {
      return loader.loadOne(Measurement, { id }, info);
    }
  },
  Mutation: {
    createExercise: async (
      _,
      { name, description, measures, categories, bodyParts, file },
      { user }
    ) => {
      const exerciseRepository = getRepository(Exercise);
      const url = await processUpload(file);
      const newExercise = await exerciseRepository.save({
        name,
        description,
        measures: measures,
        categories: categories,
        bodyParts: bodyParts,
        url,
        userId: user.id
      });
      return newExercise;
    },
    createMeasurement: async (
      _,
      { name, description, measures, categories, bodyParts },
      { user }
    ) => {
      const measurementRepository = getRepository(Measurement);
      const newMeasurement = await measurementRepository.save({
        name,
        description,
        measures: measures,
        categories: categories,
        bodyParts: bodyParts,
        userId: user.id
      });
      return newMeasurement;
    }
  },
  Assignment: {
    history: ({ id }, { userId }) => {
      return getRepository(AssignmentHistory)
        .createQueryBuilder("i")
        .innerJoinAndSelect("i.assignmentGroup", "assignmentGroup")
        .where("i.assignmentId = :assignmentId", {
          assignmentId: id
        })
        .andWhere("assignmentGroup.userId = :userId", { userId })
        .andWhere("assignmentGroup.state = :state", { state: "FINISHED" })
        .getMany();
    }
  }
};
