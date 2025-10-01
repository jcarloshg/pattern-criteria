import { ReadAllRepository } from "@/app/shared/domain/repository/crud/read-all.repository";
import { ProductToRead } from "@/app/products/domain/models/product.model";

export class GetAllProductsRepository implements ReadAllRepository<ProductToRead> {
    public run(): Promise<ProductToRead[]> {
        throw new Error("Method not implemented.");
    }
}