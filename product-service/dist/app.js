"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const mongoose = require("mongoose");
const product_1 = tslib_1.__importDefault(require("./routes/product"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/products", product_1.default);
mongoose.connect(process.env.mongodbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("Product-Service Connected to MongoDB"))
    .catch((e) => console.log(e));
app.listen(PORT, () => {
    console.log(`Product-Service listening on port ${PORT}`);
});
//# sourceMappingURL=app.js.map