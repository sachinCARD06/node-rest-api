exports.generateOtp = async (req, res) => {
  try {
    const { reqMsgId, body } = req.body;
    const { mobile, bankCode, consent } = body;

    if (!mobile || !/^[0-9]{12}$/.test(mobile)) {
      return res.status(400).json({
        message:
          "Invalid mobile number. Must be 12 digits including country code.",
      });
    }

    if (!bankCode) {
      return res.status(400).json({ message: "Bank code is required" });
    }

    if (consent !== true) {
      return res.status(400).json({ message: "Consent is required" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000);
    const sessionId = Math.random().toString(36).substring(2, 15);
    const timeout = 300; // 5 minutes in seconds

    res.status(200).json({
      reqMsgId,
      content: {
        otp,
        sessionId,
        timeout,
        status: "An OTP has been sent to your mobile number",
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { reqMsgId, body } = req.body;
    const { mobile, otp, sessionId, bankCode, pan } = body;

    if (!mobile || !/^[0-9]{12}$/.test(mobile)) {
      return res.status(400).json({
        message:
          "Invalid mobile number. Must be 12 digits including country code.",
      });
    }

    if (!bankCode) {
      return res.status(400).json({ message: "Bank code is required" });
    }

    if (!sessionId) {
      return res.status(400).json({ message: "Session ID is required" });
    }

    if (!otp || !/^[0-9]{4}$/.test(otp)) {
      return res
        .status(400)
        .json({ message: "Invalid OTP. Must be 4 digits." });
    }

    if (!pan || !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(pan)) {
      return res.status(400).json({ message: "Invalid PAN format" });
    }

    const isValid = true; // Replace this with actual OTP verification logic
    if (isValid) {
      const authToken = generateAuthenticateToken(mobile); // Replace with actual token generation
      res.setHeader("authToken", authToken);
      res.status(200).json({
        reqMsgId,
        body: {},
      });
    } else {
      res.status(400).json({
        reqMsgId,
        body: {
          errorCode: "INVALID_OTP",
          message: "Invalid OTP",
        },
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.resendOtp = async (req, res) => {
  try {
    const { reqMsgId, body } = req.body;
    const { mobile } = body;

    if (!mobile || !/^[0-9]{12}$/.test(mobile)) {
      return res.status(400).json({
        message:
          "Invalid mobile number. Must be 12 digits including country code.",
      });
    }

    const otp = Math.floor(1000 + Math.random() * 9000);
    res.status(200).json({
      reqMsgId,
      body: {
        otp,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
