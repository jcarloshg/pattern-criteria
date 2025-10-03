import { Criteria } from "@/app/shared/domain/repository/criteria/criteria.criteria";
import { CriteriaCursor } from "../criteria-cursor/criteria-cursor.criteria-cursor";

export class ReadAllRepository<Entity> {
    public async run(criteria: Criteria): Promise<Entity[]> {
        throw new Error("Method not implemented.");
    }
}

export class ReadAllByCursorRepository<Entity> {
    public async run(criteria: CriteriaCursor): Promise<Entity[]> {
        throw new Error("Method not implemented.");
    }
}
