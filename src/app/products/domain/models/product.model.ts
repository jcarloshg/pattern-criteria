import { uuid, z } from "zod";

// ─────────────────────────────────────
// CREATE SCHEMAS
// ─────────────────────────────────────

export const SchemaToCreateProduct = z.object({
    name: z.string().max(255),
    description: z.string().optional(),
    price: z.number().refine(val => val >= 0, { message: "Price must be non-negative" }),
    rating: z.number().optional(),
    availability: z.boolean(),
    brand_id: z.string().uuid(),
    category_id: z.string().uuid(),
});

export const SchemaToCreateProductRepository = z.object({
    uuid: z.string().uuid(),
    name: z.string().max(255),
    description: z.string().optional(),
    price: z.number().refine(val => val >= 0, { message: "Price must be non-negative" }),
    rating: z.number().optional(),
    availability: z.boolean(),
    brand_id: z.string().uuid(),
    category_id: z.string().uuid(),
});

export type ProductToCreate = z.infer<typeof SchemaToCreateProduct>;
export type ProductToCreateRepository = z.infer<typeof SchemaToCreateProductRepository>;


// ─────────────────────────────────────
// READ SCHEMAS
// ─────────────────────────────────────

export const SchemaToReadProduct = z.object({
    uuid: z.string().uuid(),
    name: z.string().max(255),
    description: z.string().optional(),
    price: z.number().refine(val => val >= 0, { message: "Price must be non-negative" }),
    rating: z.number().optional(),
    availability: z.boolean(),
    brand: {
        uuid: z.string().uuid(),
        name: z.string().max(255),
    },
    category: {
        uuid: z.string().uuid(),
        name: z.string().max(255),
    },
    attributes: z.array(
        z.object({
            name: z.string().max(255),
            uuid: z.string().uuid(),
            value: z.string().max(255),
        })
    ),
});

export type ProductToRead = z.infer<typeof SchemaToReadProduct>;


// ─────────────────────────────────────
// UPDATE SCHEMAS
// ─────────────────────────────────────
export const SchemaToUpdateProduct = z
    .object({
        name: z.string().max(255),
        description: z.string().optional(),
        price: z.number().refine(val => val >= 0, { message: "Price must be non-negative" }),
        rating: z.number().optional(),
        availability: z.boolean(),
        brand_id: z.string().uuid(),
        category_id: z.string().uuid(),
    })
    .partial();

export type ProductToUpdate = z.infer<typeof SchemaToUpdateProduct>;


// ─────────────────────────────────────
// DELETE SCHEMAS
// ─────────────────────────────────────

export const SchemaToDeleteProduct = z.object({
    uuid: z.string().uuid(),
});

export type ProductToDelete = z.infer<typeof SchemaToDeleteProduct>;