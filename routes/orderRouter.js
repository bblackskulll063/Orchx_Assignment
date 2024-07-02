const express = require("express");
const router = express.Router();

const orderController = require("../controllers/orderController");

// Define routes
router.post("/", orderController.createOrder);
router.get("/", orderController.getOrders);

module.exports = router;
