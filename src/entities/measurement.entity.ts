import { ChildEntity } from "typeorm";
import { Assignment } from "./assignment.entity";

@ChildEntity()
export class Measurement extends Assignment {}
