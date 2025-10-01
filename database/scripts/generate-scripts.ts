import * as fs from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';

// ─────────────────────────────────────
// interfaces
// ─────────────────────────────────────
export interface Attribute {
    uuid: string;
    name: string;
    values: string[]; // possible values for the attribute
}

export interface Brand {
    uuid: string;
    name: string;
}

export interface Category {
    uuid: string;
    name: string;
}


export interface Product {
    uuid: string;
    name: string;
    description: string;
    price: number;
    rating: number;
    available: boolean;
    brand_id: string;
    category_id: string;
}

export interface ProductAttribute {
    product_id: string;
    attribute_id: string;
    value: string;
}

// ─────────────────────────────────────
// data
// ─────────────────────────────────────

const attributesColor = [
    "Red",
    "Blue",
    "Green",
    "Yellow",
    "Purple",
    "Orange",
    "Pink",
    "Brown",
    "Black",
    "White",
    "Gray",
    "Cyan",
    "Magenta",
    "Beige",
    "Turquoise"
];

const attributesSize = [
    "Small",
    "Medium",
    "Large",
    "Extra Large",
    "XXL"
];

const attributesWeight = [
    "1 lb",
    "2 lbs",
    "5 lbs",
    "10 lbs",
    "15 lbs",
    "20 lbs",
    "25 lbs",
    "30 lbs",
    "50 lbs",
    "75 lbs",
    "100 lbs",
    "150 lbs",
    "200 lbs",
    "250 lbs",
    "300 lbs",
    "350 lbs",
    "400 lbs",
    "450 lbs",
    "500 lbs",
    "750 lbs",
    "1000 lbs"
];

const attributesDimensions = [
    "5x5x5 inches",
    "10x10x10 inches",
    "15x15x15 inches",
    "20x20x20 inches",
    "25x25x25 inches",
    "30x30x30 inches",
    "35x35x35 inches",
    "40x40x40 inches",
    "45x45x45 inches",
    "50x50x50 inches",
    "55x55x55 inches",
    "60x60x60 inches",
    "65x65x65 inches",
    "70x70x70 inches",
    "75x75x75 inches",
    "80x80x80 inches",
    "85x85x85 inches",
    "90x90x90 inches",
    "95x95x95 inches",
    "100x100x100 inches",
    "105x105x105 inches",
    "110x110x110 inches",
    "115x115x115 inches",
    "120x120x120 inches",
    "125x125x125 inches",
    "130x130x130 inches",
    "135x135x135 inches",
    "140x140x140 inches",
    "145x145x145 inches",
    "150x150x150 inches"
];

const attributesQuantity = [
    "1",
    "2",
    "3",
    "6",
    "12",
    "24",
]

const attributesMaterial = [
    "Cotton",
    "Polyester",
    "Leather",
    "Wool",
    "Silk",
    "Denim",
    "Nylon",
    "Linen",
    "Rubber",
    "Plastic",
    "Metal",
    "Wood",
    "Glass",
    "Ceramic",
    "Paper",
    "Acrylic",
    "Spandex",
    "Velvet",
    "Canvas",
    "Bamboo"
];
export const attributes: Attribute[] = [
    { "uuid": "68ab9649-6f7a-4512-8feb-fd7f3fce28ec", "name": "Color", "values": attributesColor },
    { "uuid": "3c665630-e6ed-4927-933a-394aabdb9790", "name": "Size", "values": attributesSize },
    { "uuid": "0dcf2127-2061-4298-8a28-ddf42630cb87", "name": "Material", "values": attributesMaterial },
    { "uuid": "76406729-55a7-453b-81d3-c005cb5b0ebe", "name": "Weight", "values": attributesWeight },
    { "uuid": "889f2019-9657-4327-bd81-e21acccdbe9f", "name": "Dimensions", "values": attributesDimensions },
    { "uuid": "f3575de5-b72f-466d-a2f0-7615dec686d6", "name": "Warranty", "values": ["TRUE", "FALSE"] },
    { "uuid": "f6d99980-6890-4c68-a6b3-cb36afa914ee", "name": "Quantity", "values": attributesQuantity },
];


export const brands: Brand[] = [
    { uuid: "86a0f500-d05b-44ad-badc-fb6de62a6c4b", name: "Electronics" },
    { uuid: "496a4aab-aea0-4e3f-b1de-3c1bfb1fce25", name: "Apple" },
    { uuid: "375b2c0a-24e6-4be9-9da5-3ff407c2378a", name: "Samsung" },
    { uuid: "8cf65b66-bc04-4b3f-a6cc-b0b5eb9fb606", name: "Sony" },
    { uuid: "9c280d48-3119-4704-a155-8e0df44bab87", name: "LG" },
    { uuid: "d9b9bb1a-155d-46bc-a1b6-1b506855f915", name: "Dell" },
    { uuid: "c9d28c35-59c9-4bb2-89ae-fc3598104a6f", name: "HP" },
    { uuid: "434fd64e-e27b-4762-a402-9467a309b227", name: "Lenovo" },
    { uuid: "4d95d2de-e0de-4e50-8fb1-5e940087cd15", name: "Microsoft" },
    { uuid: "223c52aa-98cd-4fe3-9463-2eb677d57743", name: "Asus" },
    { uuid: "295361d7-ec31-43b4-821b-ebd52e4246e8", name: "Acer" },
    { uuid: "e8031c74-7327-4d98-8061-c20cb0d53bfe", name: "Amazon" },
    { uuid: "ef1a48b3-960a-4c4e-b041-43b0f8bf997c", name: "Google" },
    { uuid: "3fa6135a-4061-453f-beb5-3e761751a503", name: "Nike" },
    { uuid: "3f8fb1fe-ba6a-4aef-9dc4-daca61469898", name: "Adidas" },
    { uuid: "10547ef1-c380-412c-8285-c0b02b6ff56c", name: "Puma" },
    { uuid: "8a62cd71-5c24-4220-a245-0bd760f5ec20", name: "Under Armour" },
    { uuid: "748006b2-a97d-4585-9aaf-08dcca3394a8", name: "Levis" },
    { uuid: "11bb4d7a-110b-410f-9301-acbbd827ca87", name: "H&M" },
    { uuid: "5e65fe3d-1e2c-4de4-b99e-4801fa769723", name: "Zara" },
    { uuid: "876a68a0-3f35-4a1c-a1db-f61a8d91602a", name: "KitchenAid" },
    { uuid: "8f607dc9-1d3a-4d59-9579-c684034e587b", name: "Philips" },
    { uuid: "30278a61-2bda-4590-99b6-c96923751e92", name: "Bosch" },
    { uuid: "9dd14c16-342a-4069-932c-92318e0b82a9", name: "Whirlpool" },
    { uuid: "eb471477-2d86-4b26-b34f-f57e5befa328", name: "Black+Decker" },
    { uuid: "33fa2fee-b421-474d-94c9-b53cc3a5a234", name: "Wilson" },
    { uuid: "ca5550ca-7bfb-4726-bf05-e97ba329ce91", name: "Spalding" },
    { uuid: "bbc28442-7ae8-4ba2-be41-c04e74113e9b", name: "Hasbro" },
    { uuid: "2262ecb0-90fb-4207-b421-e114063d6930", name: "Mattel" },
    { uuid: "ba1561cf-62a9-40d6-837b-dabe2c5ef51e", name: "Johnson & Johnson" },
];


export const categories: Category[] = [
    { uuid: "0d756c5a-4687-47ff-a0fa-25f381692887", name: "Electronics" },
    { uuid: "91cec3b8-cacd-4e57-8814-34a64de70978", name: "Books" },
    { uuid: "6d694138-1d02-4b5e-a1b0-a4aec21deaf0", name: "Clothing" },
    { uuid: "3eafc338-d4b7-40ec-b469-d81b8cc7face", name: "Home & Kitchen" },
    { uuid: "21621d28-5c1a-462a-802a-643ed499b3ed", name: "Sports & Outdoors" },
    { uuid: "c6c105cd-8bf3-4f5d-b6e5-6e966bb25f72", name: "Toys & Games" },
    { uuid: "69baee9b-38b9-4002-8fcc-c35e3f6fb681", name: "Health & Beauty" },
    { uuid: "d12e2ae5-aea9-4836-9899-cd1c27fe4463", name: "Automotive" },
    { uuid: "0adacf05-e2b1-465f-9e27-ffd4a92d8b4c", name: "Garden & Outdoors" },
    { uuid: "fbeaa8a9-7488-433e-adbb-111bb5e0085e", name: "Office Supplies" },
]


// ─────────────────────────────────────
// add UUIDs to products and rewrite file
// ─────────────────────────────────────
const productsPath = path.join(__dirname, 'products.json');
console.log(`productsPath: ${productsPath}`);
const productsData = fs.readFileSync(productsPath, 'utf-8');
const products = JSON.parse(productsData) as { products: any[] };

console.log(`products: ${products.products.length}`);

products.products.forEach((product: any) => {
    product.availability = "TRUE"; // all products are available
    product.uuid = randomUUID();
    product.brand_id = brands[Math.floor(Math.random() * brands.length)].uuid;
    product.category_id = categories[Math.floor(Math.random() * categories.length)].uuid;


    // product.uuid = undefined
    // product.brand_id = undefined
    // product.category_id = undefined
    // product.attributes = undefined


    // set attributes
    attributes.forEach(attribute => {
        const attributeValues = attribute.values;
        const value = attributeValues[Math.floor(Math.random() * attributeValues.length)];
        if (!product.attributes) product.attributes = [];
        product.attributes.push({
            attribute_name: attribute.name,
            attribute_id: attribute.uuid,
            value
        });
    })
    // const attributesLength = attributes.length;
    // const numberOfAttributes = Math.floor(Math.random() * attributesLength) + 1; // at least one attribute
    // const selectedAttributes = new Set<number>();
    // while (selectedAttributes.size < numberOfAttributes) {
    //     const randomIndex = Math.floor(Math.random() * attributesLength);
    //     selectedAttributes.add(randomIndex);
    // }

    // selectedAttributes.forEach(index => {
    //     const attribute = attributes[index];
    //     const attributeValues = attribute.values;
    //     const value = attributeValues[Math.floor(Math.random() * attributeValues.length)];
    //     if (!product.attributes) product.attributes = [];
    //     product.attributes.push({
    //         attribute_name: attribute.name,
    //         attribute_id: attribute.uuid,
    //         value
    //     });
    // });

});
// fs.writeFileSync(productsPath, JSON.stringify(products, null, 2), 'utf-8');

// ─────────────────────────────────────
// ─────────────────────────────────────
// generate SQL insert scripts
// ─────────────────────────────────────
// ─────────────────────────────────────

// ─────────────────────────────────────
// category
// ─────────────────────────────────────
const categorySqlInsertValuesInitial = `INSERT INTO category (uuid, name) VALUES `;
const categorySqlInsertValues = categories.map(category => `('${category.uuid}', '${category.name}')`).join(', \n');
const categorySqlInsert = categorySqlInsertValuesInitial + categorySqlInsertValues + ';';

// ─────────────────────────────────────
// brand
// ─────────────────────────────────────
const brandSqlInsertValuesInitial = `INSERT INTO brand (uuid, name) VALUES `;
const brandSqlInsertValues = brands.map(brand => `('${brand.uuid}', '${brand.name}')`).join(', \n');
const brandSqlInsert = brandSqlInsertValuesInitial + brandSqlInsertValues + ';';


// ─────────────────────────────────────
// attributes
// ─────────────────────────────────────
const attributeSqlInsertValuesInitial = `INSERT INTO attribute (uuid, name) VALUES `;
const attributeSqlInsertValues = attributes.map(attr => `('${attr.uuid}', '${attr.name}')`).join(', \n');
const attributeSqlInsert = attributeSqlInsertValuesInitial + attributeSqlInsertValues + ';';

// ─────────────────────────────────────
// product
// ─────────────────────────────────────
const productSqlInsertValuesInitial = `INSERT INTO product (uuid, name, description, price, rating, availability, brand_id, category_id) VALUES `;
const productSqlInsertValues = products.products.map(product => `('${product.uuid}', '${product.name.replace(/'/g, "''")}', '${product.description.replace(/'/g, "''")}', ${product.price}, ${product.rating}, ${product.availability}, '${product.brand_id}', '${product.category_id}')`).join(', \n');
const productSqlInsert = productSqlInsertValuesInitial + productSqlInsertValues + ';';

// ─────────────────────────────────────
// product_attributes
// ─────────────────────────────────────
const productAttributeSqlInsertValuesInitial = `INSERT INTO product_attribute (product_id, attribute_id, value) VALUES `;
const productAttributeSqlInsertValues = products.products.flatMap(product =>
    product.attributes?.map((attr: any) => `('${product.uuid}', '${attr.attribute_id}', '${attr.value}')`) || []
).join(', \n');
const productAttributeSqlInsert = productAttributeSqlInsertValuesInitial + productAttributeSqlInsertValues + ';';


const finalSqlScript = `
-- ─────────────────────────────────────
-- Category
-- ─────────────────────────────────────
${categorySqlInsert}

-- ─────────────────────────────────────
-- Brand
-- ─────────────────────────────────────
${brandSqlInsert}

-- ─────────────────────────────────────
-- Attributes
-- ─────────────────────────────────────
${attributeSqlInsert}

-- ─────────────────────────────────────
-- Products
-- ─────────────────────────────────────
${productSqlInsert}

-- ─────────────────────────────────────
-- Product Attributes
-- ─────────────────────────────────────
${productAttributeSqlInsert}
`;

// write to file
console.log(`__dirname: ${__dirname}`);
// database/
const outputPath = path.join(__dirname, '../migrations/2025-09-30/02.insert-products.UP.sql');
// const outputPath = path.join(__dirname, './insert.sql');
fs.writeFileSync(outputPath, finalSqlScript, 'utf-8');
