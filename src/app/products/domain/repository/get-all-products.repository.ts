import { ReadAllRepository } from "@/app/shared/domain/repository/crud/read-all.repository";
import { ProductToRead } from "@/app/products/domain/models/product.model";
import { Criteria } from "@/app/shared/domain/repository/criteria/criteria.criteria";

export class GetAllProductsRepository implements ReadAllRepository<ProductToRead> {
    public run(criteria: Criteria): Promise<ProductToRead[]> {
        throw new Error("Method not implemented.");
    }
}