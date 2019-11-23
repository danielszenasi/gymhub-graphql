import { IsNull, Raw, In, getRepository } from "typeorm";
import { isValid, format } from "date-fns";
import { AssignmentHistory } from "entities/assignment-history.entity";
import { Assignment } from "entities/assignment.entity";
import { GraphQLDatabaseLoader } from "@mando75/typeorm-graphql-loader";
import { GraphQLResolveInfo } from "graphql";

export class AssignmentGroupService {
  getCriteria({ type, startsAt, userId }, { trainerProfileId }) {
    if (type && type === "COMMON") {
      return {
        trainerId: trainerProfileId,
        userId: IsNull()
      };
    }
    if (startsAt && isValid(new Date(startsAt))) {
      const startsAt = Raw(alias => {
        const aliasWithQuote = alias
          .split(".")
          .map(v => `"${v}"`)
          .join(".");
        return `${aliasWithQuote}::date = '${format(
          new Date(startsAt),
          "yyyy-MM-dd"
        )}'`;
      });

      return {
        trainerId: trainerProfileId,
        ...(userId && { userId: userId }),
        ...(type && { state: type }),
        startsAt
      };
    }

    return {
      trainerId: trainerProfileId,
      ...(userId && { userId: userId }),
      ...(type && { state: type })
    };
  }

  async getCategories(
    loader: GraphQLDatabaseLoader,
    workoutId: string,
    info: GraphQLResolveInfo
  ) {
    return this.getProperty(loader, info, workoutId, "categories");
  }
  async getBodyParts(
    loader: GraphQLDatabaseLoader,
    workoutId: string,
    info: GraphQLResolveInfo
  ) {
    return this.getProperty(loader, info, workoutId, "bodyParts");
  }

  saveHistory(workoutId: string, exercises: any[]) {
    const assignmentHistoryRepository = getRepository(AssignmentHistory);

    const exerciseEntities = exercises.map((exercise, index) =>
      assignmentHistoryRepository.create({
        executed: exercise.executed,
        assignmentId: exercise.exerciseId,
        order: index,
        assignmentGroupId: workoutId
      })
    );
    return assignmentHistoryRepository.save(exerciseEntities);
  }

  private async getProperty(
    loader: GraphQLDatabaseLoader,
    info: GraphQLResolveInfo,
    workoutId: string,
    field: "categories" | "bodyParts"
  ) {
    const exerciseHistories = await loader.loadMany<AssignmentHistory>(
      AssignmentHistory,
      {
        assignmentGroupId: workoutId
      },
      info,
      { requiredSelectFields: ["assignmentId"] }
    );
    const ids = exerciseHistories.map(
      exerciseHistories => exerciseHistories.assignmentId
    );
    const uniqueIds = new Set(ids);

    const exercises = await loader.loadMany(
      Assignment,
      {
        id: In(Array.from(uniqueIds))
      },
      info,
      { requiredSelectFields: ["id", "categories", "bodyParts"] }
    );

    return Array.from(
      (exercises as any[]).reduce((set, exercise) => {
        exercise[field].forEach(category => set.add(category));
        return set;
      }, new Set())
    );
  }
}
