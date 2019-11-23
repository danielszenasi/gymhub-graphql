import { GraphQLResolveInfo } from "graphql";
import { gql } from "apollo-server";
import { WorkoutPlan } from "./entities/workout-plan.entity";
import { getRepository } from "typeorm";
import { AssignmentGroupToWorkoutPlan } from "./entities/assignment-group-to-workout-plan.entity";
import { Context } from "./main";

export const typeDef = gql`
  extend type Query {
    getWorkoutPlans: [WorkoutPlan]
  }
  extend type Mutation {
    createWorkoutPlan(
      name: String
      numberOfWorkoutsPerWeek: Int
      workouts: [String!]!
    ): WorkoutPlan
  }
  type WorkoutPlan {
    id: ID!
    numberOfWorkoutsPerWeek: Int
    name: String
    assignmentGroupToWorkoutPlans: [AssignmentGroupToWorkoutPlans]
  }
  type AssignmentGroupToWorkoutPlans {
    id: ID!
    assignmentGroup: AssignmentGroup
  }
`;
export const resolvers = {
  Query: {
    getWorkoutPlans: async (
      _,
      __,
      { loader }: Context,
      info: GraphQLResolveInfo
    ) => {
      const i = await loader.loadMany(WorkoutPlan, null, info);
      i.forEach((e: any) => console.log(e.assignmentGroupToWorkoutPlans));

      return i;
    }
  },
  Mutation: {
    createWorkoutPlan: async (
      _,
      { name, numberOfWorkoutsPerWeek, workouts },
      { user }
    ) => {
      const assignmentGroupToWorkoutPlanRepository = getRepository(
        AssignmentGroupToWorkoutPlan
      );
      const workoutPlanRepository = getRepository(WorkoutPlan);
      const workoutPlan = await workoutPlanRepository.save(
        workoutPlanRepository.create({
          name,
          numberOfWorkoutsPerWeek,
          userId: user.id
        })
      );
      const workoutToWorkoutPlans = workouts.map((workoutId, index) =>
        assignmentGroupToWorkoutPlanRepository.create({
          order: index,
          assignmentGroupId: workoutId,
          workoutPlanId: workoutPlan.id
        })
      );

      await assignmentGroupToWorkoutPlanRepository.save(workoutToWorkoutPlans);
      return workoutPlan;
    }
  }
};
