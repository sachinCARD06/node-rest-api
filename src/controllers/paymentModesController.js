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
