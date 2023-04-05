import mongoose from 'mongoose';

export interface IProduct extends mongoose.Document {
  name: string;
  price: number;
  description: string;
}