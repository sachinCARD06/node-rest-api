const express = require("express");
const {
  getPaymentModes,
  addPaymentMode,
} = require("../controllers/paymentModesController");

const router = express.Router();

router.get("/lists", getPaymentModes);
router.post("/add", addPaymentMode);

module.exports = router;
