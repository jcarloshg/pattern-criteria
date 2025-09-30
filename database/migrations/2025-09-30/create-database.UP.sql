-- Delete the database if it exists (run as superuser, outside transaction)
DROP DATABASE IF EXISTS pattern_criteria_db;

CREATE DATABASE pattern_criteria_db;

CREATE TABLE category (
    uuid UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Brand Table

CREATE TABLE brand (
    uuid UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

-- Attribute Table

CREATE TABLE attribute (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Product Table

CREATE TABLE product (
    uuid UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(12, 2) NOT NULL,
    rating REAL,
    availability BOOLEAN NOT NULL,
    brand_id UUID NOT NULL,
    category_id UUID NOT NULL,
    CONSTRAINT fk_brand FOREIGN KEY (brand_id) REFERENCES brand (uuid) ON DELETE CASCADE,
    CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES category (uuid) ON DELETE CASCADE
);

-- ProductAttribute Table

CREATE TABLE product_attribute (
    product_id UUID NOT NULL,
    attribute_id INTEGER NOT NULL,
    value VARCHAR(255) NOT NULL,
    PRIMARY KEY (product_id, attribute_id),
    CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES product (uuid) ON DELETE CASCADE,
    CONSTRAINT fk_attribute FOREIGN KEY (attribute_id) REFERENCES attribute (id) ON DELETE CASCADE
);

-- Indexes for performance

CREATE INDEX idx_product_price ON product (price);

CREATE INDEX idx_product_rating ON product (rating);

CREATE INDEX idx_product_category ON product (category_id);

CREATE INDEX idx_product_brand ON product (brand_id);

CREATE INDEX idx_productattribute_value ON product_attribute (value);

-- Optional: Full-text search index (PostgreSQL)
-- CREATE INDEX idx_product_fulltext ON product USING GIN (to_tsvector('english', name || ' ' || description));