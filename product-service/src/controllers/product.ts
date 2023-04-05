import { Request, Response, NextFunction } from "express"
import Product from "../models/product"
import amqp from "amqplib"

let order: any, channel: any, connection: any

const connectToRabbitMQ = async () => {
    const amqpServer = "amqp://guest:guest@localhost:5672";
    connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();
    await channel.assertQueue("product-service-queue");
}
connectToRabbitMQ();

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
    const { name, price, description } = req.body;
    if (!name || !price || !description) {
      return res.status(400).json({
        message: "Please provide name, price and description",
      });
    }
    const product = await new Product({ ...req.body });
    await product.save();
    return res.status(201).json({
      message: "Product created successfully",
      product,
    });
}


export const buyProduct = async (req: Request, res: Response) => {
    const { productIds } = req.body;
  const products = await Product.find({ _id: { $in: productIds } });

  // Send order to RabbitMQ order queue
  channel.sendToQueue(
    "order-service-queue",
    Buffer.from(
      JSON.stringify({
        products
      })
    )
  );

  // Consume previously placed order from RabbitMQ & acknowledge the transaction
  channel.consume("product-service-queue", (data: { content: string }) => {
    console.log("Consumed from product-service-queue");
    order = JSON.parse(data.content);
    channel.ack(data);
  });

  // Return a success message
  return res.status(201).json({
    message: "Order placed successfully",
    order,
  });
}