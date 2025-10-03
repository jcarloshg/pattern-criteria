# 🏗️ Pattern-Criteria - Product Search API

[![Node.js](https://img.shields.io/badge/Node.js-20.19.4-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15.13-336791.svg)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED.svg)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A robust Node.js API built with TypeScript that implements the **Criteria Pattern** for advanced product search with multiple filters, pagination, and cursor-based navigation. The project follows **Hexagonal Architecture** principles to ensure clean code separation and maintainability.

## 📋 Table of Contents

- [🎯 Main Use Case](#-main-use-case)
  - [Problem Description](#problem-description)
  - [Solution Overview](#solution-overview)
- [🔍 Criteria Pattern Implementation](#-criteria-pattern-implementation)
  - [Standard Criteria Pattern](#standard-criteria-pattern)
  - [Cursor-Based Criteria Pattern](#cursor-based-criteria-pattern)
  - [Benefits of This Implementation](#benefits-of-this-implementation)
- [🗄️ Database Structure](#️-database-structure)
  - [Key Features](#key-features)
- [🏛️ Hexagonal Architecture](#️-hexagonal-architecture)
  - [Architecture Benefits](#architecture-benefits)
- [🐳 Docker Setup](#-docker-setup)
  - [Services Architecture](#services-architecture)
  - [Quick Start](#quick-start)
  - [Service Details](#service-details)
- [🚀 API Usage Examples](#-api-usage-examples)
  - [Base URL](#base-url)
  - [Health Check](#health-check)
  - [Basic Product Retrieval](#basic-product-retrieval)
  - [Advanced Filtering Examples](#advanced-filtering-examples)
    - [1. Filter by Brand](#1-filter-by-brand)
    - [2. Filter by Price Range](#2-filter-by-price-range)
    - [3. Text Search with Sorting](#3-text-search-with-sorting)
    - [4. Complex Multi-Filter Query](#4-complex-multi-filter-query)
  - [Cursor-Based Pagination](#cursor-based-pagination)
    - [1. Initial Request](#1-initial-request)
    - [2. Next Page Request](#2-next-page-request)
  - [Available Operators](#available-operators)
  - [Response Format](#response-format)
- [🧪 Testing](#-testing)
  - [Running Tests](#running-tests)
  - [Test Structure](#test-structure)
  - [Example Test Scenarios](#example-test-scenarios)
  - [Test Categories](#test-categories)
    - [1. Application Layer Tests](#1-application-layer-tests)
    - [2. Infrastructure Layer Tests](#2-infrastructure-layer-tests)
    - [3. Criteria Pattern Tests](#3-criteria-pattern-tests)
- [🛠️ Development](#️-development)
  - [Prerequisites](#prerequisites)
  - [Available Scripts](#available-scripts)
  - [Packages](#packages)
    - [Production Dependencies](#production-dependencies)
    - [Development Dependencies](#development-dependencies)
    - [Key Package Highlights](#key-package-highlights)

## 🎯 Main Use Case

### Problem Description

Modern e-commerce applications require sophisticated search capabilities that go beyond simple text matching. Users need to filter products by multiple criteria simultaneously while maintaining good performance and user experience.

**Key Challenges:**

- **Complex Query Building**: Traditional approaches lead to complex, hard-to-maintain SQL queries
- **Dynamic Filtering**: Supporting various filter combinations without code duplication
- **Performance**: Optimizing queries for large product catalogs
- **Scalability**: Handling high query volumes efficiently
- **Pagination**: Implementing both offset-based and cursor-based pagination

### Solution Overview

This project implements an **Advanced Product Search System** that allows users to:

- 🗂️ **Category Filtering**: Search by product categories (electronics, clothing, etc.)
- 💲 **Price Range**: Filter by minimum and maximum price limits
- 🏷️ **Brand Selection**: Filter by preferred brands
- ⭐ **Rating-based**: Select products based on user ratings
- 🛠️ **Attribute Filtering**: Apply additional filters (color, size, availability)
- 📊 **Flexible Pagination**: Support both offset-based and cursor-based pagination
- 🔍 **Text Search**: Search by product name with CONTAINS operators

## 🔍 Criteria Pattern Implementation

The **Criteria Pattern** is a design pattern that encapsulates query logic in a reusable, composable way. This project implements two variations:

### Standard Criteria Pattern

```typescript
// Core Classes
class Criteria {
  public filters: Filter[];
  public orders: Order;
  public pagination: Pagination;
}

class Filter {
  public field: string;
  public operator: Operator; // =, !=, >, <, CONTAINS, NOT_CONTAINS
  public value: string;
}

class Order {
  public orderBy: string;
  public orderType: OrderType; // ASC, DESC
}

class Pagination {
  public page: number;
  public pageSize: number;
}
```

### Cursor-Based Criteria Pattern

```typescript
// Enhanced for cursor-based pagination
class CriteriaCursor {
  public filters: FilterCursor[];
  public pagination: PaginationCursor;
  public order: OrderCursor;
}

class PaginationCursor {
  public pageSize: number;
}

class OrderCursor {
  public value: string; // cursor value
  public cursor: string; // field to cursor by
  public direction: OrderCursorType; // ASC, DESC
}
```

### Benefits of This Implementation

- **🔧 Reusability**: Criteria objects can be reused across different repositories
- **🧪 Testability**: Easy to test query logic in isolation
- **🔄 Composability**: Filters can be combined dynamically
- **📝 Type Safety**: Full TypeScript support with validation
- **🏗️ Maintainability**: Clear separation of query logic from data access

## 🗄️ Database Structure

The database follows a normalized structure optimized for search operations:

- [migrations folder](database/migrations)

```sql
-- Core Tables
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Category  │    │    Brand    │    │  Attribute  │
│             │    │             │    │             │
│ uuid (PK)   │    │ uuid (PK)   │    │ uuid (PK)   │
│ name        │    │ name        │    │ name        │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       │                   │                   │
       └───────┐   ┌───────┘                   │
               │   │                           │
            ┌─────────────┐                    │
            │   Product   │                    │
            │             │                    │
            │ uuid (PK)   │                    │
            │ name        │                    │
            │ description │                    │
            │ price       │◄───── indexed      │
            │ rating      │◄───── indexed      │
            │ availability│                    │
            │ brand_id    │                    │
            │ category_id │                    │
            └─────────────┘                    │
                   │                           │
                   │                           │
            ┌─────────────────┐                │
            │ ProductAttribute│◄───────────────┘
            │                 │
            │ product_id (FK) │
            │ attribute_id(FK)│
            │ value           │
            └─────────────────┘
```

### Key Features

- **🔍 Optimized Indexes**: Price and rating fields are indexed for fast filtering
- **🔗 Foreign Key Constraints**: Ensure data integrity with cascading deletes
- **📊 Flexible Attributes**: ProductAttribute table allows dynamic product properties
- **🏷️ Normalized Design**: Separate tables for categories and brands reduce redundancy

## 🏛️ Hexagonal Architecture

The project implements Hexagonal Architecture (Ports and Adapters) for clean separation of concerns:

```
src/
├── app/                           # Application Core
│   ├── products/
│   │   ├── application/           # Use Cases
│   │   │   ├── get-all-products.application.ts
│   │   │   └── get-products-by-cursor.application.ts
│   │   ├── domain/                # Business Logic
│   │   │   ├── models/
│   │   │   │   └── product.model.ts
│   │   │   └── repository/        # Repository Interfaces (Ports)
│   │   │       ├── get-all-products.repository.ts
│   │   │       └── get-total-of-products.repository.ts
│   │   └── infra/                 # Infrastructure (Adapters)
│   │       └── postgres/
│   │           ├── get-all-products.postgres.ts
│   │           └── get-products-by-cursor.postgres.ts
│   └── shared/                    # Shared Domain Logic
│       ├── domain/
│       │   ├── repository/
│       │   │   ├── criteria/      # Criteria Pattern Implementation
│       │   │   └── criteria-cursor/
│       │   └── errors/
│       └── infrastructure/
│           ├── criteria/          # Criteria Parsers
│           └── database/
└── presentation/                  # External Interface
    ├── controllers/
    ├── routes/
    └── middleware/
```

### Architecture Benefits

- **🎯 Domain Isolation**: Business logic is independent of external concerns
- **🔌 Dependency Inversion**: Infrastructure depends on domain, not vice versa
- **🧪 Testability**: Easy to mock external dependencies
- **🔄 Flexibility**: Easy to swap implementations (e.g., database providers)
- **📦 Modularity**: Clear boundaries between layers

## 🐳 Docker Setup

The project uses Docker Compose for easy development setup with three services:

### Services Architecture

```yaml
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│    Backend      │    │   PostgreSQL    │    │    pgAdmin      │
│   (Node.js)     │    │   Database      │    │   (Web UI)      │
│                 │    │                 │    │                 │
│ Port: 3000      │◄──►│ Port: 5432      │    │ Port: 8080      │
│                 │    │                 │    │                 │
│ Volume: ./src   │    │ Volume: ./data  │    │ Volume: ./pgadmin│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Quick Start

- [docker-compose](docker-compose.yml)
- [Dockerfile](Dockerfile)

1. **Clone the repository**

   ```bash
   git clone https://github.com/jcarloshg/pattern-criteria.git
   cd pattern-criteria
   ```

2. **Start services with Docker Compose**

   ```bash
   docker-compose up -d
   ```

3. **Verify services are running**
   ```bash
   docker-compose ps
   ```

### Service Details

| Service        | Port | Purpose                | Credentials                |
| -------------- | ---- | ---------------------- | -------------------------- |
| **Backend**    | 3000 | Node.js API server     | -                          |
| **PostgreSQL** | 5432 | Database server        | `admin:123456`             |
| **pgAdmin**    | 8080 | Database management UI | `alumno@google.com:123456` |

## 🚀 API Usage Examples

### Base URL

```
http://localhost:3000/api/products/v1
```

### Health Check

```http
GET http://localhost:3000/api/health
```

### Basic Product Retrieval

```http
# Get all products (with default pagination)
GET http://localhost:3000/api/products/v1

# Get products with pagination
GET http://localhost:3000/api/products/v1?page=1&pageSize=10
```

### Advanced Filtering Examples

#### 1. Filter by Brand

```http
GET http://localhost:3000/api/products/v1?[0][field]=brandName&[0][operator]=EQUAL&[0][value]=Puma
```

#### 2. Filter by Price Range

```http
GET http://localhost:3000/api/products/v1?[0][field]=price&[0][operator]=GT&[0][value]=50&[1][field]=price&[1][operator]=LT&[1][value]=200
```

#### 3. Text Search with Sorting

```http
GET http://localhost:3000/api/products/v1?[0][field]=name&[0][operator]=CONTAINS&[0][value]=Travel&orderBy=price&order=ASC
```

#### 4. Complex Multi-Filter Query

```http
GET http://localhost:3000/api/products/v1?[0][field]=brandName&[0][operator]=EQUAL&[0][value]=Nike&[1][field]=price&[1][operator]=GT&[1][value]=100&[2][field]=availability&[2][operator]=EQUAL&[2][value]=true&orderBy=rating&order=DESC&page=1&pageSize=5
```

### Cursor-Based Pagination

#### 1. Initial Request

```http
GET http://localhost:3000/api/products/v1/cursor?cursor=name&direction=ASC&pageSize=10
```

#### 2. Next Page Request

```http
GET http://localhost:3000/api/products/v1/cursor?value=<cursor_value>&cursor=name&direction=ASC&pageSize=10
```

### Available Operators

| Operator       | Description          | Example                                   |
| -------------- | -------------------- | ----------------------------------------- |
| `EQUAL`        | Exact match          | `brandName = "Nike"`                      |
| `NOT_EQUAL`    | Not equal            | `availability != false`                   |
| `GT`           | Greater than         | `price > 100`                             |
| `LT`           | Less than            | `rating < 4.0`                            |
| `CONTAINS`     | Text contains        | `name CONTAINS "Travel"`                  |
| `NOT_CONTAINS` | Text doesn't contain | `description NOT_CONTAINS "discontinued"` |

### Response Format

```json
{
  "statusCode": 200,
  "message": "Products retrieved successfully",
  "data": {
    "data": [
      {
        "uuid": "product-uuid",
        "name": "Product Name",
        "description": "Product Description",
        "price": 99.99,
        "rating": 4.5,
        "availability": true,
        "brand": {
          "uuid": "brand-uuid",
          "name": "Brand Name"
        },
        "category": {
          "uuid": "category-uuid",
          "name": "Category Name"
        }
      }
    ],
    "total": 150,
    "totalPages": 15
  }
}
```

## 🧪 Testing

### Running Tests

- copy [.env.template](./.env.template) as `.env.test.local`

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run jest

# Run specific test file
npm test -- get-products-by-cursor.application.test.ts
```

The project includes comprehensive tests covering different layers of the architecture:

### Test Structure

```
test/
└── src/
    ├── app/
    │   ├── products/
    │   │   ├── application/
    │   │   │   └── get-products-by-cursor.application.test.ts
    │   │   └── infra/
    │   │       └── postgres/
    │   │           └── get-value.postgres.test.ts
    │   └── shared/
    │       └── infrastructure/
    │           └── criteria/
    │               ├── criteria-cursor-to-sql.test.ts
    │               └── urlsearch-to-criteria-cursor.test.ts
```

### Example Test Scenarios

1. **Cursor Pagination Flow**: Tests complete pagination cycle with multiple requests
2. **SQL Query Generation**: Validates criteria conversion to parameterized SQL
3. **URL Parameter Parsing**: Tests conversion of query strings to criteria objects
4. **Repository Integration**: Tests database operations with real data

### Test Categories

#### 1. **Application Layer Tests**

- **Purpose**: Test business logic and use cases
- **Example**: `get-products-by-cursor.application.test.ts`
- **Coverage**: End-to-end cursor pagination flow
- **Approach**: Integration tests with real database connections

#### 2. **Infrastructure Layer Tests**

- **Purpose**: Test data access and external integrations
- **Example**: `get-value.postgres.test.ts`
- **Coverage**: PostgreSQL repository implementations
- **Approach**: Database integration tests

#### 3. **Criteria Pattern Tests**

- **Purpose**: Test query building and URL parsing
- **Examples**:
  - `criteria-cursor-to-sql.test.ts` - SQL generation from criteria
  - `urlsearch-to-criteria-cursor.test.ts` - URL parameter parsing
- **Coverage**: Query logic validation
- **Approach**: Unit tests with mocked dependencies

## 🛠️ Development

### Prerequisites

- **Node.js**: 20.19.4 or higher
- **Docker**: For containerized development
- **PostgreSQL**: 15.13 (via Docker)

### Available Scripts

```bash
# Development
npm run dev              # Start development server with hot reload
npm run dev:docker       # Start for Docker environment

# Building
npm run build            # Compile TypeScript to JavaScript
npm run clean            # Remove compiled files

# Database
npm run generate-sql-scripts  # Generate database scripts

# Testing
npm test                 # Run test suite
npm run jest            # Run tests in watch mode
```

### Packages

#### Production Dependencies

| Package     | Version | Purpose                                       |
| ----------- | ------- | --------------------------------------------- |
| **express** | ^5.1.0  | Fast, unopinionated web framework for Node.js |
| **cors**    | ^2.8.5  | Cross-Origin Resource Sharing middleware      |
| **dotenv**  | ^17.2.3 | Environment variables loader                  |
| **pg**      | ^8.16.3 | PostgreSQL client for Node.js                 |
| **zod**     | ^4.1.11 | TypeScript-first schema validation library    |

#### Development Dependencies

| Package            | Version | Purpose                                 |
| ------------------ | ------- | --------------------------------------- |
| **@types/cors**    | ^2.8.19 | TypeScript definitions for cors         |
| **@types/express** | ^5.0.3  | TypeScript definitions for Express      |
| **@types/jest**    | ^30.0.0 | TypeScript definitions for Jest         |
| **@types/node**    | ^24.6.0 | TypeScript definitions for Node.js      |
| **@types/pg**      | ^8.15.5 | TypeScript definitions for pg           |
| **@types/uuid**    | ^10.0.0 | TypeScript definitions for UUID         |
| **jest**           | ^30.2.0 | JavaScript testing framework            |
| **nodemon**        | ^3.1.10 | Development server with auto-restart    |
| **ts-jest**        | ^29.4.4 | Jest transformer for TypeScript         |
| **ts-node**        | ^10.9.2 | TypeScript execution engine for Node.js |
| **tsconfig-paths** | ^4.2.0  | Path mapping support for TypeScript     |

#### Key Package Highlights

- **🚀 Express 5.1.0**: Latest version with improved performance and modern features
- **🔒 Zod 4.1.11**: Powerful schema validation for API endpoints and data models
- **🐘 PostgreSQL 8.16.3**: Robust database client with connection pooling
- **🧪 Jest 30.2.0**: Modern testing framework with TypeScript support
- **⚡ Nodemon**: Development server with hot-reload capabilities

---

**Built with ❤️ by Jose Carlos HG** | [View on GitHub](https://github.com/jcarloshg/pattern-criteria)
