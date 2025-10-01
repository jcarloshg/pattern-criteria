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
WHERE
    brand.name = 'Puma'
    OR product_attribute.value = 'Red'
GROUP BY
    product.uuid,
    brand.uuid,
    category.uuid;

-- b.uuid,
-- c.uuid,
-- pa."value";