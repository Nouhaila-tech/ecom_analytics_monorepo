import { Router } from 'express'; // Importing Router from Express
import { getProducts, getProductById } from '../controllers/productController';

const router = Router();

// Use controllers directly (correct Express signature)
router.get('/', getProducts); 
router.get('/:id', getProductById);

export default router;

