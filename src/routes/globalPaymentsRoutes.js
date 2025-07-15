const express = require("express");
const {
  globalPaymentsInitiate,
  globalPaymentsVerify,
} = require("../controllers/globalPaymentsController");

const router = express.Router();

router.post("/payment-initiate", globalPaymentsInitiate);
router.post("/verify/:txnid", globalPaymentsVerify);

module.exports = router;
