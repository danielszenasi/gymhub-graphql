import { ChildEntity } from "typeorm";
import { AssignmentGroup } from "./assignment-group.entity";

@ChildEntity()
export class Workout extends AssignmentGroup {}
