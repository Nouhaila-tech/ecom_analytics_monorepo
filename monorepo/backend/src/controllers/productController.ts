import { Request, Response } from 'express';
import Product from '../models/Product';

// Get all products
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.status(200).json(products); // Let Express handle the returned response
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
};

// Get product by ProductID
export const getProductById = async (req: Request, res: Response) => {
  try {
    const productID = parseInt(req.params.id, 10); // Convert param to number

    if (isNaN(productID)) {
      res.status(400).json({ message: 'Invalid Product ID format' });
      return; // Explicitly return here to avoid further execution
    }

    const product = await Product.findOne({ ProductID: productID });
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return; // Explicitly return
    }

    res.status(200).json(product); // Return response object
  } catch (err) {
    res.status(500).json({ message: 'Error fetching product', error: err });
  }
};
