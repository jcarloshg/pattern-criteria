import { ProductToRead } from "../../domain/models/product.model";
import { GetAllProductsRepository } from "../../domain/repository/get-all.repository";

export class GetAllProductsPostgres implements GetAllProductsRepository {
    constructor() { }

    public run(): Promise<ProductToRead[]> {
        try {
            const query = "SELECT * FROM product;"
        } catch (error) {

        }
        throw new Error("Method not implemented.");
    }

}