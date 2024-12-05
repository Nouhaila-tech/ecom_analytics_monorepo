import { Request, Response} from 'express';
import Sale from '../models/Sale';
import Product from '../models/Product';

export const getTotalSales = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;

    // Validate start and end dates
    if (!startDate || !endDate) {
      res.status(400).json({ message: "Provide both start date & end date" });
      return;
    }

    // Parse and validate date formats
    const startD = new Date(startDate as string);
    const endD = new Date(endDate as string);

    if (isNaN(startD.getTime()) || isNaN(endD.getTime())) {
      res.status(400).json({ message: "Invalid date format. Use YYYY-MM-DD" });
      return;
    }

    // Format dates as ISO strings (date only)
    const formattedStart = startD.toISOString().split('T')[0];
    const formattedEnd = endD.toISOString().split('T')[0];

    // Aggregate total sales based on the date range
    const totalSales = await Sale.aggregate([
      {
        $match: {
          Date: { $gte: formattedStart, $lte: formattedEnd },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$TotalAmount" },
        },
      },
    ]);

    // Calculate the total sales amount
    const total = totalSales.length > 0 ? totalSales[0].total : 0;

    // Aggregate monthly sales with Date conversion
    const monthlySales = await Sale.aggregate([
      {
        $match: {
          Date: { $gte: formattedStart, $lte: formattedEnd },
        },
      },
      {
        $project: {
          // Convert Date string to Date type
          month: {
            $month: {
              $toDate: "$Date",  // Convert Date string to Date object
            },
          },
          totalAmount: "$TotalAmount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$totalAmount" },
        },
      },
      {
        $sort: { _id: 1 }, // Sort by month
      },
    ]);

    // Fill in missing months with sales = 0
    const allMonths = Array.from({ length: 12 }, (_, index) => index + 1);
    const formattedMonthlySales = allMonths.map((month) => {
      const monthData = monthlySales.find((sale) => sale._id === month);
      return { month, totalSales: monthData ? monthData.total : 0 };
    });

    res.status(200).json({ totalSales: total, monthlySales: formattedMonthlySales });
  } catch (error) {
    console.error("Error fetching total sales and monthly sales:", error);
    res.status(500).json({ message: "Error calculating total sales", error });
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
              {$limit:5}, 
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