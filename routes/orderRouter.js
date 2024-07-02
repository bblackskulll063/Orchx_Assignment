const express = require("express");
const router = express.Router();

const orderController = require("../controllers/orderController");

// Define routes
router
  .route("/")
  .post(orderController.createOrder)
  .get(orderController.getOrders);

router.get("/total/sales", orderController.getTotalSalesAmount);
router.get("/parts/mostselling", orderController.getMostSellingParts);

module.exports = router;
