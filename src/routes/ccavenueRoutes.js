const express = require("express");
const {
  ccavenueInitiate,
  ccavenueVerify,
} = require("../controllers/ccavenueController");

const router = express.Router();

router.post("/payment-initiate", ccavenueInitiate);
router.post("/ccavenue-verify/:status/:txnid", ccavenueVerify);

module.exports = router;
