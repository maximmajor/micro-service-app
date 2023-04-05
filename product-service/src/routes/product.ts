import express from "express"
import {createProduct, buyProduct} from "../controllers/product"


const router = express.Router()



router.post("/", createProduct)
router.post("/buy", buyProduct)


export default router 