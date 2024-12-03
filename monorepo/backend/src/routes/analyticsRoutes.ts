import { Router } from 'express';
import { getTotalSales, getTrendingProducts, getCategorySales } from '../controllers/analyticsController';

const router = Router();

router.get('/total_sales', (req, res) => getTotalSales(req, res));
router.get('/trending_products', (req,res) => getTrendingProducts(req, res));
router.get('/category_sales', (req,res) => getCategorySales(req, res));

export default router;
