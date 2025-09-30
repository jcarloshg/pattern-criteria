# Database Design: Advanced Product Search

This document describes the database design to support the use case: **Advanced Product Search with Multiple Filters**.

## Entities

- **Product**

  - uuid (PK)
  - name
  - description
  - price
  - rating
  - availability
  - brand_id (FK)
  - category_id (FK)

- **Category**

  - uuid (PK)
  - name

- **Brand**

  - uuid (PK)
  - name

- **Attribute**

  - id (PK)
  - name (e.g., color, size)

- **ProductAttribute**
  - product_id (FK)
  - attribute_id (FK)
  - value

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
