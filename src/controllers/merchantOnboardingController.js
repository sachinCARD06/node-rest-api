exports.createMerchantOnboarding = async (req, res) => {
  try {
    const {
      reqMsgId,
      body: {
        mobile,
        gst,
        officialEmail,
        accountId,
        consent,
        merchantInfo: {
          businessCategory,
          businessSubCategory,
          businessType,
          businessGenre,
        },
        keepAddressSame,
        address: { line1, line2, line3, city, stateCode, pinCode, countryCode },
      },
    } = req.body;

    // Validate required fields
    if (
      !mobile ||
      !officialEmail ||
      !accountId ||
      !businessCategory ||
      !businessSubCategory ||
      !businessType ||
      !businessGenre ||
      !line1 ||
      !line2 ||
      !city ||
      !stateCode ||
      !pinCode ||
      !countryCode
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate mobile format
    if (!mobile.match(/^91[0-9]{10}$/)) {
      return res.status(400).json({ message: "Invalid mobile number format" });
    }

    // Validate email format
    if (!officialEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Validate consent
    if (!consent) {
      return res.status(400).json({ message: "Consent is required" });
    }

    // TODO: Add merchant onboarding logic here

    res.status(200).json({
      message: "Merchant onboarding created successfully",
      reqMsgId,
      merchantId: Math.random().toString(36).substring(2, 15),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
