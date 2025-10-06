import * as fs from 'fs';
import * as path from 'path';

const productsPath_01 = path.join(__dirname, 'products_01.json');
const productsPath_02 = path.join(__dirname, 'products_02.json');

const productsData_01 = fs.readFileSync(productsPath_01, 'utf-8');
const products_01 = JSON.parse(productsData_01);
const productsData_02 = fs.readFileSync(productsPath_02, 'utf-8');
const products_02 = JSON.parse(productsData_02);

const allProducts = [...products_01, ...products_02];