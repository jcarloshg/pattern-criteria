# Database Design: Advanced Product Search

This document describes the database design to support the use case: **Advanced Product Search with Multiple Filters**.

## Entities

- **Product**

  - `uuid` (PK): `UUID`
  - `name`: `String`
  - `description`: `Text`
  - `price`: `Decimal`
  - `rating`: `Float`
  - `availability`: `Boolean`
  - `brand_id` (FK): `UUID`
  - `category_id` (FK): `UUID`

- **Category**

  - `uuid` (PK): `UUID`
  - `name`: `String`

- **Brand**

  - `uuid` (PK): `UUID`
  - `name`: `String`

- **Attribute**

  - `id` (PK): `Integer`
  - `name`: `String` (e.g., color, size)

- **ProductAttribute**
  - `product_id` (FK): `UUID`
  - `attribute_id` (FK): `Integer`
  - `value`: `String`

## Relationships

- A product belongs to one category and one brand.
- A product can have multiple attributes (color, size, etc.).
- Categories and brands are referenced by products.

## Example ER Diagram

```
Product --< ProductAttribute >-- Attribute
	 |
	 |-- Brand
	 |-- Category
```

## Indexing & Performance

- Index on `price`, `rating`, `category_id`, `brand_id`, and frequently queried attributes for fast filtering.
- Consider full-text search for product name/description.

## Scalability

- Use partitioning/sharding for large catalogs.
- Optimize queries for multi-filter combinations.

---

by: Jose Carlos HG
