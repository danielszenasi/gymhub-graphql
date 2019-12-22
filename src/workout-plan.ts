import { GraphQLResolveInfo } from "graphql";
import { gql } from "apollo-server";
import { WorkoutPlan } from "./entities/workout-plan.entity";
import { getRepository } from "typeorm";
import { AssignmentGroupToWorkoutPlan } from "./entities/assignment-group-to-workout-plan.entity";
import { Context } from "./main";
import { AssignmentGroupState } from "./entities/assignment-group.entity";
import { Workout } from "./entities/workout.entity";
import { AssignmentHistory } from "./entities/assignment-history.entity";

export const typeDef = gql`
  extend type Query {
    getWorkoutPlans: [WorkoutPlan]
  }
  extend type Mutation {
    createWorkoutPlan(
      nameEn: String
      nameHu: String
      numberOfWorkoutsPerWeek: Int
      workouts: [String!]!
    ): WorkoutPlan
    attachWorkoutPlanToUser(userId: ID!, workoutPlanId: ID!): [AssignmentGroup]
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
      return loader.loadMany(WorkoutPlan, null, info);
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
    },
    attachWorkoutPlanToUser: async (_, { userId, workoutPlanId }, { user }) => {
      const assignmentGroupToWorkoutPlanRepository = getRepository(
        AssignmentGroupToWorkoutPlan
      );

      const workoutRepository = getRepository(Workout);
      const assignmentHistoryRepository = getRepository(AssignmentHistory);
      const assignmentGroupToWorkoutPlan = await assignmentGroupToWorkoutPlanRepository.find(
        {
          where: { workoutPlanId },
          relations: [
            "assignmentGroup",
            "assignmentGroup.assignmentHistories",
            "assignmentGroup.assignmentHistories.executions"
          ]
        }
      );

      const { max } = await workoutRepository
        .createQueryBuilder("workout")
        .select("MAX(workout.order)", "max")
        .where({ userId: user.id })
        .getRawOne();

      const workoutEntities = assignmentGroupToWorkoutPlan.map((item, index) =>
        workoutRepository.create({
          state: AssignmentGroupState.PLANNED,
          userId,
          trainerId: user.trainerProfileId,
          parentId: item.assignmentGroupId,
          order: max + index + 1,
          nameEn: item.assignmentGroup.nameEn
        })
      );

      const newWorkouts = await workoutRepository.save(workoutEntities);

      const assignmentHistories = assignmentGroupToWorkoutPlan.reduce(
        (acc, item) => {
          return {
            ...acc,
            [item.assignmentGroupId]: item.assignmentGroup.assignmentHistories
          };
        },
        {}
      );

      const entities = newWorkouts.reduce((acc, workout) => {
        const newAssignmentHistories = assignmentHistories[
          workout.parentId
        ].map(assignmentHistory =>
          assignmentHistoryRepository.create({
            executions: assignmentHistory.executed.map(exec => ({
              measureId: exec.measureId,
              value: exec.value
            })),
            order: assignmentHistory.order,
            assignmentId: assignmentHistory.assignmentId,
            assignmentGroupId: workout.id
          })
        );
        return acc.concat(newAssignmentHistories);
      }, []);

      await assignmentHistoryRepository.save(entities);
      return newWorkouts;
    }
  }
};
