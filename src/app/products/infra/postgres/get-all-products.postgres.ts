import { postgresManager, PostgresManagerType } from "@/app/shared/infrastructure/database/postgres/postgress-manager";
import { ProductToRead } from "@/app/products/domain/models/product.model";
import { GetAllProductsRepository } from "@/app/products/domain/repository/get-all-products.repository";
import { Criteria } from "@/app/shared/domain/repository/criteria/criteria.criteria";
import { CriteriaToSql, ParameterizedQuery } from "@/app/shared/infrastructure/criteria/criteria-to-sql";

export class GetAllProductsPostgres implements GetAllProductsRepository {

    constructor(
        private readonly PostgresManager: PostgresManagerType
    ) { }

    // ─────────────────────────────────────
    // main method
    // ─────────────────────────────────────

    public async run(criteria: Criteria): Promise<ProductToRead[]> {
        const parameterizedQuery = this.buildParameterizedQuery(criteria);
        try {
            const result = await this.PostgresManager.runParameterizedQuery(
                parameterizedQuery.query,
                parameterizedQuery.parameters
            );
            return result.rows;
        } catch (error) {
            throw error;
        }
    }

    // ─────────────────────────────────────
    // auxiliary methods
    // ─────────────────────────────────────

    private buildParameterizedQuery(criteria: Criteria): ParameterizedQuery {

        const propertiesMap: Map<string, string> = new Map<string, string>([
            ["uuid", "product.uuid"],
            ["name", "product.name"],
            ["description", "product.description"],
            ["availability", "product.availability"],
            ["price", "product.price"],
            ["rating", "product.rating"],
            ["brandName", "brand.name"],
            ["categoryName", "category.name"],
            ["attributeValue", "product_attribute.value"],
        ]);

        const criteriaToSql = new CriteriaToSql()
            .buildSelect([
                "product.uuid as uuid",
                "product.name as name",
                "product.description as description",
                "product.availability as availability",
                "product.price as price",
                "product.rating as rating",
                "array_agg(jsonb_build_object( 'uuid', attribute.uuid, 'value', product_attribute.value, 'name', attribute.name)) AS attributes",
                "jsonb_build_object('uuid', brand.uuid, 'name', brand.name) AS brand",
                "jsonb_build_object('uuid', category.uuid, 'name', category.name) AS category"
            ])
            .buildFrom("product")
            .addJoin("JOIN", "product_attribute", "product.uuid", "product_attribute.product_id")
            .addJoin("JOIN", "attribute", "product_attribute.attribute_id", "attribute.uuid")
            .addJoin("JOIN", "brand", "product.brand_id", "brand.uuid")
            .addJoin("JOIN", "category", "product.category_id", "category.uuid")
            .buildWhere(criteria, propertiesMap)
            .buildOrderBy(criteria)
            .buildPagination(criteria)
            .addGroupBy(["product.uuid", "brand.uuid", "category.uuid"])
            .getResult();

        return {
            query: criteriaToSql.query,
            parameters: criteriaToSql.parameters
        };
    }

}