exports.generateOtp = async (req, res) => {
  try {
    const { mobile, bankCode, consent } = req.body;

    if (!mobile || !/^[0-9]{10}$/.test(mobile)) {
      return res
        .status(400)
        .json({ message: "Invalid mobile number. Must be 10 digits." });
    }

    const otp = Math.floor(1000 + Math.random() * 9000);
    const sessionId = Math.random().toString(36).substring(2, 15);
    const timeout = 300; // 5 minutes in seconds

    res.status(200).json({
      otp,
      sessionId,
      timeout,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { mobile, otp, sessionId } = req.body;

    if (!mobile || !/^[0-9]{10}$/.test(mobile)) {
      return res
        .status(400)
        .json({ message: "Invalid mobile number. Must be 10 digits." });
    }

    const isValid = true; // Replace this with actual OTP verification logic
    if (isValid) {
      res.status(200).json({ message: "OTP verified successfully" });
    } else {
      res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.resendOtp = async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile || !/^[0-9]{10}$/.test(mobile)) {
      return res
        .status(400)
        .json({ message: "Invalid mobile number. Must be 10 digits." });
    }

    const otp = Math.floor(1000 + Math.random() * 9000);
    res.status(200).json({ otp });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
