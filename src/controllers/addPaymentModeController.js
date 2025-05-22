exports.addPaymentMode = async (req, res) => {
  try {
    const { reqMsgId, body } = req.body;
    const { paymentModes } = body;

    if (!paymentModes || !Array.isArray(paymentModes)) {
      return res
        .status(400)
        .json({ message: "Payment modes array is required" });
    }

    for (const mode of paymentModes) {
      if (!mode.sourceType || typeof mode.isPaymentModeEnabled !== "boolean") {
        return res.status(400).json({
          message:
            "Each payment mode must have sourceType and isPaymentModeEnabled fields",
        });
      }

      const validSourceTypes = ["SAVINGS", "CREDIT_CARD", "CREDIT_LINE", "PPI"];
      if (!validSourceTypes.includes(mode.sourceType)) {
        return res.status(400).json({
          message: `Invalid source type: ${mode.sourceType}`,
        });
      }
    }

    res.status(200).json({
      reqMsgId,
      body: {},
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
