import { GetAllProductsRepository } from "@/app/products/domain/repository/get-all.repository";

export class GetAllProductsApplication {

    constructor(private readonly repository: GetAllProductsRepository) { }

    public async run(): Promise<void> {
        try {

        } catch (error) {

        }

    }
}