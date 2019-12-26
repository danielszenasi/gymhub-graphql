import { IsNull, Raw, In, getRepository } from "typeorm";
import { isValid, format, parseISO } from "date-fns";
import { AssignmentHistory } from "../entities/assignment-history.entity";
import { Assignment } from "../entities/assignment.entity";

import { Workout } from "../entities/workout.entity";
import { Statistics } from "../entities/statistics.entity";
import { AssignmentGroupState } from "../entities/assignment-group.entity";

export class AssignmentGroupService {
  getCriteria({ type, startsAt, userId }, user) {
    if (type && type === "GLOBAL") {
      return {
        isPublic: true,
        deletedAt: IsNull()
      };
    }
    const { trainerProfileId } = user;
    if (type && type === "COMMON") {
      return {
        trainerId: trainerProfileId,
        userId: IsNull(),
        deletedAt: IsNull()
      };
    }

    if (startsAt && isValid(parseISO(startsAt))) {
      const startsAtRaw = Raw(alias => {
        const aliasWithQuote = alias
          .split(".")
          .map(v => `"${v}"`)
          .join(".");
        return `${aliasWithQuote}::date = '${format(
          parseISO(startsAt),
          "yyyy-MM-dd"
        )}'`;
      });

      return {
        trainerId: trainerProfileId,
        startsAt: startsAtRaw,
        deletedAt: IsNull(),
        ...(userId && { userId: userId }),
        ...(type && { state: type })
      };
    }

    return {
      trainerId: trainerProfileId,
      deletedAt: IsNull(),
      ...(userId && { userId: userId }),
      ...(type && { state: type })
    };
  }

  async getCategories(workoutId: string) {
    return this.getProperty(workoutId, "categories");
  }
  async getBodyParts(workoutId: string) {
    return this.getProperty(workoutId, "bodyParts");
  }

  async saveStatistics(
    { nameEn, startsAt, measurements, userId, state },
    { trainerProfileId }
  ) {
    const statisticsRepository = getRepository(Statistics);

    const newStatistics = await statisticsRepository.save(
      statisticsRepository.create({
        nameEn,
        startsAt,
        userId,
        state,
        trainerId: trainerProfileId
      })
    );

    const newAssignmentHistories = await this.saveHistory(
      newStatistics.id,
      measurements
    );
    return {
      ...newStatistics,
      assignmentHistories: newAssignmentHistories
    };
  }

  async saveWorkout(
    { nameEn, startsAt, exercises, userId, state },
    { trainerProfileId }
  ) {
    const workoutRepository = getRepository(Workout);

    const newWorkout = await workoutRepository.save(
      workoutRepository.create({
        nameEn,
        state,
        startsAt,
        userId,
        trainerId: trainerProfileId
      })
    );

    const newExercises = await this.saveHistory(newWorkout.id, exercises);
    return { ...newWorkout, exercises: newExercises };
  }

  async updateWorkout(
    { workoutId, nameEn, startsAt, exercises, state },
    { trainerProfileId }
  ) {
    const assignmentHistoryRepository = getRepository(AssignmentHistory);

    const workoutRepository = getRepository(Workout);
    await assignmentHistoryRepository.delete({
      assignmentGroupId: workoutId
    });

    const newWorkout = await workoutRepository.save(
      workoutRepository.create({
        id: workoutId,
        state: state,
        startsAt,
        nameEn,
        trainerId: trainerProfileId
      })
    );

    const newExercises = await this.saveHistory(newWorkout.id, exercises);
    const ids = newExercises.map(e => e.id);

    const assignmentHistories = await assignmentHistoryRepository.find({
      where: { id: In(ids) },
      relations: [
        "assignment",
        "executions",
        "executions.measure",
        "assignment.bodyParts",
        "assignment.measures",
        "assignment.categories"
      ]
    });

    return { ...newWorkout, assignmentHistories };
  }

  async updateStatistics(
    { statisticsId, nameEn, startsAt, measurements, state },
    { trainerProfileId }
  ) {
    const assignmentHistoryRepository = getRepository(AssignmentHistory);
    const statisticsRepository = getRepository(Statistics);
    await assignmentHistoryRepository.delete({
      assignmentGroupId: statisticsId
    });

    const newWorkout = await statisticsRepository.save(
      statisticsRepository.create({
        id: statisticsId,
        state: state,
        startsAt,
        nameEn,
        trainerId: trainerProfileId
      })
    );

    const newMeasurements = await this.saveHistory(newWorkout.id, measurements);

    return { ...newWorkout, assignmentHistories: newMeasurements };
  }

  saveHistory(assignmentGroupId: string, assignments: any[]) {
    const assignmentHistoryRepository = getRepository(AssignmentHistory);

    const exerciseEntities = assignments.map((assignment, index) =>
      assignmentHistoryRepository.create({
        executions: assignment.executed.map(exec => ({
          measureId: exec.measureId,
          value: exec.value
        })),
        assignmentId: assignment.id,
        order: index,
        assignmentGroupId
      })
    );
    return assignmentHistoryRepository.save(exerciseEntities);
  }

  private async getProperty(
    workoutId: string,
    field: "categories" | "bodyParts"
  ) {
    const assignmentRepository = getRepository(Assignment);
    const assignmentHistoryRepository = getRepository(AssignmentHistory);
    const exerciseHistories = await assignmentHistoryRepository.find({
      where: { assignmentGroupId: workoutId },
      select: ["assignmentId"]
    });

    const ids = exerciseHistories.map(
      exerciseHistories => exerciseHistories.assignmentId
    );
    const uniqueIds = new Set(ids);

    const exercises = await assignmentRepository.find({
      where: { id: In(Array.from(uniqueIds)) },
      relations: ["categories", "bodyParts"]
    });

    const result = exercises.reduce((set, exercise) => {
      const items = exercise[field].reduce((acc, item) => {
        return { ...acc, [item.id]: item };
      }, {});
      return { ...set, ...items };
    }, {});

    return Object.keys(result).map(key => result[key]);
  }

  private async attachAssignmentGroup(
    userId,
    assignmentGroupId,
    user,
    repository
  ) {
    const assignmentHistoryRepository = getRepository(AssignmentHistory);
    const { max } = await repository
      .createQueryBuilder("assignmentGroup")
      .select("MAX(assignmentGroup.order)", "max")
      .where({ userId: user.id })
      .getRawOne();

    const workout = await repository.findOneOrFail(assignmentGroupId, {
      relations: ["assignmentHistories", "assignmentHistories.executions"]
    });

    const newWorkout = await repository.save({
      state: AssignmentGroupState.PLANNED,
      userId,
      trainerId: user.trainerProfileId,
      parentId: assignmentGroupId,
      order: max + 1,
      nameEn: workout.nameEn,
      nameHu: workout.nameHu
    });

    const assignmentHistoryEntities = workout.assignmentHistories!.map(
      assignmentHistory =>
        assignmentHistoryRepository.create({
          executions: assignmentHistory.executions.map(exec => ({
            measureId: exec.measureId,
            value: exec.value
          })),
          order: assignmentHistory.order,
          assignmentId: assignmentHistory.assignmentId,
          assignmentGroupId: newWorkout.id
        })
    );
    const assignmentHistories = await assignmentHistoryRepository.save(
      assignmentHistoryEntities
    );
    return { ...newWorkout, assignmentHistories };
  }

  public async attachWorkout({ userId, workoutId }, user) {
    const workoutRepository = getRepository(Workout);

    return await this.attachAssignmentGroup(
      userId,
      workoutId,
      user,
      workoutRepository
    );
  }

  public async attachStatistics({ userId, statisticsId }, user) {
    const statisticsRepository = getRepository(Statistics);
    return await this.attachAssignmentGroup(
      userId,
      statisticsId,
      user,
      statisticsRepository
    );
  }

  public async deleteWorkout(id: string) {
    const workoutRepository = getRepository(Workout);
    return await workoutRepository.save({ id, deletedAt: new Date() });
  }

  public async deleteStatistics(id: string) {
    const statisticsRepository = getRepository(Statistics);
    return await statisticsRepository.save({ id, deletedAt: new Date() });
  }
}
