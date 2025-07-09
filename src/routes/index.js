const express = require("express");
const { verifyAuthenticateToken } = require("../utils/authTokenHeader");
const otpRoutes = require("./otpRoutes");
const userRoutes = require("./userRoutes");
const bankAccountsRoutes = require("./bankAccountsRoutes");
const paymentModesRoutes = require("./paymentModesRoutes");
const merchantOnboardingFieldRoutes = require("./merchantOnboardingFieldRoutes");
const stateCodeRoutes = require("./stateCodeRoutes");
const createMerchantOnboardingRoutes = require("./createMerchantOnboardingRoutes");
const payuRoutes = require("./payuRoutes");
const ccavenueRoutes = require("./ccavenueRoutes");

const router = express.Router();

router.use("/otp", otpRoutes);
router.use("/users", userRoutes);
router.use("/bank-accounts", verifyAuthenticateToken, bankAccountsRoutes);
router.use("/payment-modes", verifyAuthenticateToken, paymentModesRoutes);
router.use("/fields", verifyAuthenticateToken, merchantOnboardingFieldRoutes);
router.use("/state-codes", verifyAuthenticateToken, stateCodeRoutes);
router.use(
  "/merchant-onboarding",
  verifyAuthenticateToken,
  createMerchantOnboardingRoutes
);
router.use("/payu", payuRoutes);
router.use("/ccavenue", ccavenueRoutes);

module.exports = router;
