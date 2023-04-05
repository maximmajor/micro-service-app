import mongoose from "mongoose";
import {IProduct} from "../interface/product"
const Schema = mongoose.Schema;

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const product = mongoose.model("Product", ProductSchema);
export default  product 
