const express = require("express");
const userRoutes = require("./userRoutes");
const bankAccountsRoutes = require("./bankAccountsRoutes");
const paymentModesRoutes = require("./paymentModesRoutes");
const otpRoutes = require("./otpRoutes");
const router = express.Router();

router.use("/users", userRoutes);
router.use("/bank-accounts", bankAccountsRoutes);
router.use("/payment-modes", paymentModesRoutes);
router.use("/otp", otpRoutes);
module.exports = router;
