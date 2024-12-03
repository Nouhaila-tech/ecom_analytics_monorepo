import { Request, Response} from 'express';
import Sale from '../models/Sale';
import Product from '../models/Product';

export const getTotalSales = async (req: Request, res:Response): Promise<void>=> {
    try {
        const { startDate, endDate } = req.query;
        if (!startDate || !endDate) {
            res.status(400).json({ message: "Provide start date & end date"});
            return;
        }

        const startD = new Date (startDate as string).toISOString().split('T')[0];
        const endD = new Date (endDate as string).toISOString().split('T')[0];

        if(isNaN(new Date(startD).getTime()) || isNaN(new Date(endD).getTime())) {
            res.status(400).json({ message: "Date format invalid"});
            return;
        }

        const totalSales = await Sale.aggregate([
            {
                $match:{
                    Date: {$gte: startD, $lte: endD},
                },
            },
            {
                $group: {
                    _id: null,
                    total: {$sum: "$TotalAmount"},
                },
            },
        ]);

        const total = totalSales.length > 0 ? totalSales[0].total : 0;
        res.status(200).json({ totalSales: total});
    } catch (error) {
        res.status(500).json({ message: "Error calculating total sales", error});
    }
};


export const getTrendingProducts = async(req:Request, res:Response): Promise<void> => {
    try {
        const trendingProducts = await Sale.aggregate([
            {
                $group: {
                  _id:'$ProductID', 
                  totalQuantity: {$sum:'$Quantity' }, 
                  totalSales: { $sum:'$TotalAmount'}, 
                },
              },
              {$sort: {totalQuantity: -1}}, 
              {$limit:3}, 
        ]);

        const populatedProducts = await Promise.all(
      trendingProducts.map(async (product) => {
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
    res.status(500).json({ message: 'Error fetching trending products', error });
  }
};


export const getCategorySales = async (req:Request, res: Response): Promise<void> => {
    try{
        const categorySales = await Sale.aggregate([
            {
                $lookup: {
                  from:'products', 
                  localField: 'ProductID',
                  foreignField:'ProductID',
                  as:'productInfo',
                },
              },
              { $unwind:'$productInfo' }, 
              {
                $group: {
                  _id:'$productInfo.Category', 
                  totalSales: {$sum:'$TotalAmount' },
                  totalQuantity: {$sum:'$Quantity'}, 
                },
              },
        ]);

        const totalAmount=categorySales.reduce((sum, category) => sum + category.totalSales,0);
        const categorySalesPercentage = categorySales.map((category)=>{
            const percentage=((category.totalSales/totalAmount)*100).toFixed(2);
            return{
                category: category._id,
                totalSales: category.totalSales,
                totalQuantity: category.totalQuantity,
                percentage: percentage+'%',
            };
        });
        res.status(200).json(categorySalesPercentage);
    }catch(error){
        res.status(500).json({message:'error fetching category sales',error})
    }
}