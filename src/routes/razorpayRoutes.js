const express = require("express");
const {
  razorpayInitiate,
  razorpayVerify,
} = require("../controllers/razorpayController");

const router = express.Router();

router.post("/payment-initiate", razorpayInitiate);
router.post("/verify/:txnid", razorpayVerify);

module.exports = router;
