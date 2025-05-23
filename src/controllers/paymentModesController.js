const paymentModesList = {
  content: {
    paymentModes: [
      {
        sourceType: "SAVINGS",
        displayName: "Savings Account",
        description: "Accept Payments from Bank Accounts",
        charges: null,
      },
      {
        sourceType: "CREDIT_CARD",
        displayName: "Credit Card",
        description:
          "Accept Payments from Credit Cards, Charges applicable upto 1.99%",
        charges: 1.99,
      },
      {
        sourceType: "CREDIT_LINE",
        displayName: "Credit Line",
        description:
          "Accept Payments from Credit Line, Charges applicable upto 1.99%",
        charges: 1.99,
      },
      {
        sourceType: "PPI",
        displayName: "PPI",
        description:
          "Accept Payments from Pre Paid Instruments, Charges applicable upto 1.99%",
        charges: 1.99,
      },
    ],
  },
};

exports.getPaymentModes = async (req, res) => {
  try {
    res.status(200).json(paymentModesList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

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

    // Update paymentModesList with enabled/disabled status
    paymentModesList.content.paymentModes =
      paymentModesList.content.paymentModes.map((mode) => {
        const updatedMode = paymentModes.find(
          (m) => m.sourceType === mode.sourceType
        );
        if (updatedMode) {
          return {
            ...mode,
            isPaymentModeEnabled: updatedMode.isPaymentModeEnabled,
          };
        }
        return mode;
      });

    res.status(200).json({
      reqMsgId,
      message: "Payment modes updated successfully",
      data: {
        primaryTerminal: {
          terminalId: "TERUX865766002583",
          terminalVpaHandle: "terux865766002583.mer@card91",
          status: "ACTIVE",
          staticQr:
            "upi://pay?pa=terux865766002583.mer@card91&pn=Reliance&mc=3001&mid=MERHV9492&msid=STRHVLH378807286408&mtid=TERUX865766002583",
        },
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
