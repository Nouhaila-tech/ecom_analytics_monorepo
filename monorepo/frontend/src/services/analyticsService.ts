import axios, { AxiosError } from 'axios';

export interface Product {
  ProductID: number;
  ProductName: string;
  Category: string;
  Price: number;
}

export interface TrendingProduct {
  productName: string;
  totalQuantity: number;
  totalSales: number;
}

export interface MonthlySales {
  month: number;
  totalSales: number;
}

export interface TotalSalesResponse {
  totalSales: number;
  monthlySales: MonthlySales[];
}

export interface CategorySales {
  category: string;
  totalSales: number;
  totalQuantity: number;
  percentage: string;
}

export interface ProductSales {
  productName: string;
  totalQuantity: number;
  totalSales: number;
}

export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const response = await axios.get<Product[]>('/api/products');
    console.log('API Response (Products):', response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error, 'Error fetching products');
    return []; 
  }
};

export const getTrendingProducts = async (): Promise<TrendingProduct[]> => {
  try {
    const response = await axios.get<TrendingProduct[]>('/api/analytics/trending_products');
    console.log('API Response (Trending Products):', response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error,'Error fetching trending products');
    return [];
  }
};


export const getTotalSalesAndMonthlyData =async (startDate: string = '', endDate: string = ''): Promise<TotalSalesResponse> => {
  try {
    console.log('Sending request with parameters:', { startDate, endDate }); // Log request params
    const params = {startDate,endDate };
    const response =await axios.get<TotalSalesResponse>('/api/analytics/total_sales', { params });
    console.log('API Response (Total Sales & Monthly Data):', response.data); // Log API response
    return response.data;
  } catch (error) {
    handleAxiosError(error,'Error fetching sales data');
    throw error; 
  }
};


export const getCategorySales = async (): Promise<CategorySales[]> => {
  try {
    const response = await axios.get<CategorySales[]>('/api/analytics/category_sales');
    console.log('API Response (Category Sales):', response.data);
    return response.data;
  } catch (error) {
    handleAxiosError(error, 'Error fetching category sales');
    return [];
  }
};


export const getProductSales = async (): Promise<ProductSales[]> => {
  try {
    const response = await axios.get<ProductSales[]>('/api/analytics/product_sales/1');
    console.log('API Response (Product Sales):', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching product sales:', error);
    return [];
  }
};


const handleAxiosError = (error: unknown,message: string): void => {
  if (axios.isAxiosError(error)) {
    console.error(`${message}:`, error.response?.data || error.message);
    if (error.response) {
      console.error('Response:',error.response);
      console.error('Status:', error.response.status);
      console.error('Headers:',error.response.headers);
    }
  } else {
    console.error(`${message}:`,error);
  }
};
