const express = require("express");
const { getPaymentModes } = require("../controllers/paymentModesController");

const router = express.Router();

router.get("/", getPaymentModes);

module.exports = router;
