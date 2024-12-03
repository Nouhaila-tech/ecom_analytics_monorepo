import { Router } from 'express';
import { getTotalSales } from '../controllers/analyticsController';

const router = Router();

router.get('/total_sales', (req, res) => getTotalSales(req, res));

export default router;
