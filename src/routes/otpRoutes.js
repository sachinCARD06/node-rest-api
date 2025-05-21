const express = require("express");
const router = express.Router();
const otpController = require("../controllers/otpController");

router.post("/generate-otp", otpController.generateOtp);
router.post("/verify-otp", otpController.verifyOtp);
router.post("/resend-otp", otpController.resendOtp);

module.exports = router;
