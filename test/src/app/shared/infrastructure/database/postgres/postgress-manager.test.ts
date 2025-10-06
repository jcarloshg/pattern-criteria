import { CriteriaToSql } from "@/app/shared/infrastructure/criteria/criteria-to-sql";
import { URLSearchToCriteria } from "@/app/shared/infrastructure/criteria/urlsearch-to-criteria";
import { postgresManager } from "@/app/shared/infrastructure/database/postgres/postgress-manager";

describe("postgress-manager.test", () => {
    it("should work with criteria", async () => {
        // parse criteria from url
        const urlBase = "http://localhost:3000/api/products/v1";
        const urlPagination = "?&page=1&pageSize=10";
        const urlOrder = "&orderBy=price&order=ASC";
        const urlFilter1 = "&[0][field]=name&[0][operator]=CONTAINS&[0][values]=[coffe, cheesy]";
        const urlFilter2 = "&[1][field]=price&[1][operator]=GTOE&[1][values]=[5]";
        const url = `${urlBase}${urlPagination}${urlOrder}${urlFilter1}${urlFilter2}`;
        const searchParams = new URL(url).searchParams;
        const criteria = URLSearchToCriteria.parse(searchParams);

        // ─────────────────────────────────────
        // works with the parser
        // ─────────────────────────────────────
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

        const res = await postgresManager.runParameterizedQuery(
            criteriaToSql.query,
            criteriaToSql.parameters
        );

        expect(res).toBeDefined();
    });
});
