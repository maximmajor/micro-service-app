import  express from "express";
const app = express();
const PORT = process.env.PORT || 3002;
const mongoose = require("mongoose");
import amqp from "amqplib";
import  Order from "./models/order";
import dotenv from 'dotenv';
dotenv.config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
let channel: any, connection: any;

mongoose.connect(process.env.mongodbUrl1, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Order-Service Connected to MongoDB"))
  .catch((e: any) => console.log(e));

// RabbitMQ connection
async function connectToRabbitMQ() {
  const amqpServer = "amqp://guest:guest@localhost:5672";
  connection = await amqp.connect(amqpServer);
  channel = await connection.createChannel();
  await channel.assertQueue("order-service-queue");
}

// Create an order
const createOrder = (products: any[]) => {
  let total = 0;
  products.forEach((product: { price: number; }) => {
    total += product.price;
  });

  const order = new Order({
    products,
    total,
  });
  order.save();
  return order;
};

connectToRabbitMQ().then(() => {
  channel.consume("order-service-queue", (data: { content: string; }) => {
    // order service queue listens to this queue
    const { products } = JSON.parse(data.content);
    const newOrder = createOrder(products);
    channel.ack(data);
    channel.sendToQueue(
      "product-service-queue",
      Buffer.from(JSON.stringify(newOrder))
    );
  });
});

app.listen(PORT, () => {
  console.log(`Order-Service listening on port ${PORT}`);
});
