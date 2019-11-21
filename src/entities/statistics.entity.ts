import { ChildEntity } from "typeorm";
import { AssignmentGroup } from "./assignment-group.entity";

@ChildEntity()
export class Statistics extends AssignmentGroup {}
