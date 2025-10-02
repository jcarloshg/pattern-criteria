import { Criteria } from "@/app/shared/domain/repository/criteria/criteria.criteria";

export class ReadAllRepository<Entity> {
    public async run(criteria: Criteria): Promise<Entity[]> {
        throw new Error("Method not implemented.");
    }
}
