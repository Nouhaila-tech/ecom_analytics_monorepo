import { Router } from 'express';
import { getProducts, getProductById, getProductSales } from '../controllers/productController';

const router = Router();

// Define the routes
router.get('/', getProducts);               
router.get('/:id', getProductById);         
router.get('/product_sales', getProductSales);
router.get('/product_sales/:id', getProductSales); 

export default router;
