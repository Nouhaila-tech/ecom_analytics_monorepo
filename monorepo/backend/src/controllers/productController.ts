import {Request, Response } from 'express';
import Product from '../models/Product';

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