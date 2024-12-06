import mongoose from 'mongoose';
import { Schema, Document } from 'mongoose';

export interface Product extends Document {
    ProductID: number;
    ProductName: string;
    Category: string;
    Price: number;
  }
  
  const productSchema = new Schema<Product>({
    ProductID: { type: Number, required: true, unique: true },
    ProductName: { type: String, required: true },
    Category: { type: String, required: true },
    Price: { type: Number, required: true },
  });
  
export default mongoose.model<Product>('Product', productSchema)