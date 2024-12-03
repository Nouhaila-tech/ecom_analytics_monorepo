import { Request, Response } from 'express';
import Sale from '../models/Sale';

export const getTotalSales = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      res.status(400).json({ message: 'Please provide both startDate and endDate' });
      return;
    }

    // Convert string dates to YYYY-MM-DD format
    const start = new Date(startDate as string).toISOString().split('T')[0];
    const end = new Date(endDate as string).toISOString().split('T')[0];

    // Ensure date range is valid
    if (isNaN(new Date(start).getTime()) || isNaN(new Date(end).getTime())) {
      res.status(400).json({ message: 'Invalid date format' });
      return;
    }

    // Query for sales where the date is within the range
    const totalSales = await Sale.aggregate([
      {
        $match: {
          Date: { $gte: start, $lte: end }, // Compare string dates
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$TotalAmount' },
        },
      },
    ]);

    const total = totalSales.length > 0 ? totalSales[0].total : 0;
    res.status(200).json({ totalSales: total });
  } catch (error) {
    res.status(500).json({ message: 'Error calculating total sales', error });
  }
};
