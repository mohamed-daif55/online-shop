const express = require("express");
const router = express.Router();
const ProductsController = require("../controllers/productsController");
const isAuth = require("../middelware/authRoutes");

router.get("/add-products", isAuth, ProductsController.getAddProduct);

router.post("/add-products", isAuth, ProductsController.postAddProducts);

module.exports = router;