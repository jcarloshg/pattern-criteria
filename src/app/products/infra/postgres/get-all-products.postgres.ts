import { postgresManager, PostgresManagerType } from "@/app/shared/infrastructure/database/postgres/postgress-manager";
import { ProductToRead } from "@/app/products/domain/models/product.model";
import { GetAllProductsRepository } from "@/app/products/domain/repository/get-all-products.repository";
import { Criteria } from "@/app/shared/domain/repository/criteria/criteria.criteria";
import { CriteriaParserSql, ParameterizedQuery } from "@/app/shared/infrastructure/criteria/creteria-parser-sql.criteria";

export class GetAllProductsPostgres implements GetAllProductsRepository {

    constructor(
        private readonly PostgresManager: PostgresManagerType
    ) { }

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

        const criteriaParser = new CriteriaParserSql(criteria);
        const parameterizedWhere = criteriaParser.getParameterizedWhereClause(propertiesMap);
        const order = criteriaParser.getOrderByClause(propertiesMap);

        const baseQuery = `
        SELECT
            product.uuid as uuid,
            product.name as name,
            product.description as description,
            product.availability as availability,
            product.price as price,
            product.rating as rating,
            array_agg(
                jsonb_build_object(
                    'uuid',
                    attribute.uuid,
                    'value',
                    product_attribute.value,
                    'name',
                    attribute.name
                )
            ) AS attributes,
            jsonb_build_object(
                'uuid',
                brand.uuid,
                'name',
                brand.name
            ) AS brand,
            jsonb_build_object(
                'uuid',
                category.uuid,
                'name',
                category.name
            ) AS category
        FROM
            product
            JOIN product_attribute ON product.uuid = product_attribute.product_id
            JOIN attribute ON product_attribute.attribute_id = attribute.uuid
            JOIN brand ON product.brand_id = brand.uuid
            JOIN category ON product.category_id = category.uuid

        ${parameterizedWhere.query}

        GROUP BY
            product.uuid,
            brand.uuid,
            category.uuid

        ${order}
        ;
        `;

        return {
            query: baseQuery,
            parameters: parameterizedWhere.parameters
        };
    }

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

}