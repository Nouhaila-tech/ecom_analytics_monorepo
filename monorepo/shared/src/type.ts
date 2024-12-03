export interface Product {
    id: string;
    name: string;
    price: string;
    category: string;
    totalSales: string;
}

export interface Sale {
    productId: string;
    quantity: number;
    date: string;
}