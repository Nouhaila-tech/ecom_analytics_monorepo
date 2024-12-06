import {Request, Response } from 'express';
import Product from '../models/Product';
import Sale from '../models/Sale';

export const getProducts = async (req:Request, res:Response) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    }catch (error) {
        res.status(500).json({message: "error fetching data", error});

    }
};

export const getProductById = async (req:Request, res:Response) => {
    try {
        const productId= parseInt(req.params.id , 10);
        if (isNaN(productId)) {
            res.status(400).json({message: 'Id not found'});
            return;
        }

        const product = await Product.findOne({ ProductID : productId});
        if(!product) {
            res.status(404).json({message:'Product not found'});
            return;
        }
        res.status(200).json(product);
    }catch(error){
        res.status(500).json({message:"error fetching product", error:error});
    }
}

export const getProductSales = async (req: Request, res: Response): Promise<void> => {
    try {
      const productSales = await Sale.aggregate([
        {
          $group: {
            _id: '$ProductID',
            totalQuantity: { $sum: '$Quantity' },
            totalSales: { $sum: '$TotalAmount' },
          },
        },
        { $sort: { totalSales: -1 } },
      ]);
  
      const populatedProducts = await Promise.all(
        productSales.map(async (product) => {
          const productDetails = await Product.findOne({ ProductID: product._id });
          return {
            productName: productDetails?.ProductName || 'Unknown Product',
            totalQuantity: product.totalQuantity,
            totalSales: product.totalSales,
          };
        })
      );
  
      res.status(200).json(populatedProducts);
    } catch (error) {
      console.error('Error fetching product sales:', error);
      res.status(500).json({ message: 'Error fetching product sales', error });
    }
  };
  