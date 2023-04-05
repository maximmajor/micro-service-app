"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const product_1 = require("../controllers/product");
const router = express_1.default.Router();
router.post("/", product_1.createProduct);
router.post("/buy", product_1.buyProduct);
exports.default = router;
//# sourceMappingURL=product.js.map