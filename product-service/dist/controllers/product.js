"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buyProduct = exports.createProduct = void 0;
const tslib_1 = require("tslib");
const product_1 = tslib_1.__importDefault(require("../models/product"));
const amqplib_1 = tslib_1.__importDefault(require("amqplib"));
let order, channel, connection;
const connectToRabbitMQ = async () => {
    const amqpServer = "amqp://guest:guest@localhost:5672";
    connection = await amqplib_1.default.connect(amqpServer);
    channel = await connection.createChannel();
    await channel.assertQueue("product-service-queue");
};
connectToRabbitMQ();
const createProduct = async (req, res, next) => {
    const { name, price, description } = req.body;
    if (!name || !price || !description) {
        return res.status(400).json({
            message: "Please provide name, price and description",
        });
    }
    const product = await new product_1.default({ ...req.body });
    await product.save();
    return res.status(201).json({
        message: "Product created successfully",
        product,
    });
};
exports.createProduct = createProduct;
const buyProduct = async (req, res) => {
    const { productIds } = req.body;
    const products = await product_1.default.find({ _id: { $in: productIds } });
    // Send order to RabbitMQ order queue
    channel.sendToQueue("order-service-queue", Buffer.from(JSON.stringify({
        products
    })));
    // Consume previously placed order from RabbitMQ & acknowledge the transaction
    channel.consume("product-service-queue", (data) => {
        console.log("Consumed from product-service-queue");
        order = JSON.parse(data.content);
        channel.ack(data);
    });
    // Return a success message
    return res.status(201).json({
        message: "Order placed successfully",
        order,
    });
};
exports.buyProduct = buyProduct;
//# sourceMappingURL=product.js.map