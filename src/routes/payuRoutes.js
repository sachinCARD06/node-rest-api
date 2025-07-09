const express = require("express");
const {
  pgDataValidation,
  generateHashForPayU,
  getPayments,
  verifyStatus,
  verifyPaymentStatus,
  getPaymentStatus,
} = require("../controllers/payuController");

const router = express.Router();

router.post("/payment-initiate", pgDataValidation);
router.post("/verify-payment/:txnid", verifyPaymentStatus);
router.get("/get-payment-status/:txnid", getPaymentStatus);

router.post("/payU-hash", generateHashForPayU);

router.get("/get-payments", getPayments);
router.get("/verify/:status/:txnid", verifyStatus);

module.exports = router;
