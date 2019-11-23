import { GraphQLResolveInfo } from "graphql";
import { gql } from "apollo-server";
import { WorkoutPlan } from "./entities/workout-plan.entity";
import { getRepository } from "typeorm";
import { AssignmentGroupToWorkoutPlan } from "./entities/assignment-group-to-workout-plan.entity";

export const typeDef = gql`
  extend type Query {
    getWorkoutPlans: [Workout]
  }
  extend type Mutation {
    createWorkoutPlan(name: String, workouts: [WorkoutInput!]!): Workout
  }
  input WorkoutInput {
    workoutId: ID!
    order: Int!
    week: Int!
  }
  type WorkoutPlan {
    id: ID!
    name: String
  }
`;
export const resolvers = {
  Query: {
    getWorkoutPlans: (_, args, { user, loader }, info: GraphQLResolveInfo) => {
      console.log(user, loader, args, info);

      return [];
    }
  },
  Mutation: {
    createWorkoutPlan: async (_, { name, workouts }, { user }) => {
      const assignmentGroupToWorkoutPlanRepository = getRepository(
        AssignmentGroupToWorkoutPlan
      );
      const workoutPlanRepository = getRepository(WorkoutPlan);
      const workoutPlan = await workoutPlanRepository.save(
        workoutPlanRepository.create({ name, userId: user.id })
      );
      const workoutToWorkoutPlans = workouts.map(({ workoutId, order }) =>
        assignmentGroupToWorkoutPlanRepository.create({
          order,
          assignmentGroupId: workoutId,
          workoutPlanId: workoutPlan.id
        })
      );

      await assignmentGroupToWorkoutPlanRepository.save(workoutToWorkoutPlans);
      return workoutPlan;
    }
  }
};
