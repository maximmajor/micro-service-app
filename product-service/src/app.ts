import express from "express";
const app = express();
const PORT = process.env.PORT || 3000;
const mongoose = require("mongoose");
import dotenv from 'dotenv';
import productRouter from "./routes/product";
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/products", productRouter);
console.log(process.env.mongodbUrl)
mongoose.connect(process.env.mongodbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Product-Service Connected to MongoDB"))
  .catch((e: any) => console.log(e));

app.listen(PORT, () => {
  console.log(`Product-Service listening on port ${PORT}`);
});
