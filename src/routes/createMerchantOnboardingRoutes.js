const express = require("express");
const router = express.Router();
const {
  createMerchantOnboarding,
} = require("../controllers/merchantOnboardingController");

router.post("/", createMerchantOnboarding);

module.exports = router;
