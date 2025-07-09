const express = require("express");
const {
  globalPaymentsInitiate,
  globalPaymentsVerify,
} = require("../controllers/globalPaymentsController");

const router = express.Router();

router.get("/payment-initiate", globalPaymentsInitiate);
router.get("/verify/:status/:txnid", globalPaymentsVerify);

module.exports = router;
