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
      nameEn: String
      nameHu: String
      descriptionEn: String
      descriptionHu: String
      measures: [String]!
      categories: [String]!
      bodyParts: [String]!
      file: Upload
    ): Assignment
    createMeasurement(
      nameEn: String
      nameHu: String
      descriptionEn: String
      descriptionHu: String
      measures: [String]!
      categories: [String]!
      bodyParts: [String]
    ): Assignment
  }
  type Assignment {
    id: ID!
    nameEn: String
    nameHu: String
    descriptionEn: String
    descriptionHu: String
    url: String
    measures: [Measure]!
    categories: [Category]!
    bodyParts: [BodyPart]!
    history(userId: ID): [AssignmentHistory]
  }
`;
export const resolvers = {
  Query: {
    getExercises: async (_, { ids }, { user, loader }, info) => {
      const criteria = user ? { userId: user.id } : { isPublic: true };
      const r = await loader.loadMany(
        Exercise,
        [{ ...criteria, ...(ids && { id: In(ids) }) }],
        info
      );
      r.forEach(i => console.log(i.categories));

      return r;
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
      {
        nameEn,
        nameHu,
        descriptionEn,
        descriptionHu,
        measures,
        categories,
        bodyParts,
        file
      },
      { user }
    ) => {
      const exerciseRepository = getRepository(Exercise);
      const url = file ? await processUpload(file) : null;
      const newExercise = await exerciseRepository.save({
        nameEn,
        descriptionEn,
        nameHu,
        descriptionHu,
        measures: measures.map(measure => ({
          id: measure
        })),
        categories: categories.map(category => ({
          id: category
        })),
        bodyParts: bodyParts.map(bodyPart => ({
          id: bodyPart
        })),
        url,
        userId: user.id
      });
      return newExercise;
    },
    createMeasurement: async (
      _,
      {
        nameEn,
        descriptionEn,
        nameHu,
        descriptionHu,
        measures,
        categories,
        bodyParts
      },
      { user }
    ) => {
      const measurementRepository = getRepository(Measurement);
      const newMeasurement = await measurementRepository.save({
        nameEn,
        descriptionEn,
        nameHu,
        descriptionHu,
        measures: measures.map(measure => ({
          id: measure
        })),
        categories: categories.map(category => ({
          id: category
        })),
        bodyParts: bodyParts
          ? bodyParts.map(bodyPart => ({
              id: bodyPart
            }))
          : null,
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
        .innerJoinAndSelect("i.executions", "executions")
        .innerJoinAndSelect("executions.measure", "measure")
        .where("i.assignmentId = :assignmentId", {
          assignmentId: id
        })
        .andWhere("assignmentGroup.userId = :userId", { userId })
        .andWhere("assignmentGroup.state = :state", {
          state: "FINISHED"
        })
        .getMany();
    }
  }
};
