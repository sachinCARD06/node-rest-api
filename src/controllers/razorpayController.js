const crypto = require("crypto");
const fetch = require("node-fetch");
const base64 = require("base-64");
const { razorpayConfig } = require("../config/razorpayConfig");
const {
  encryptCcAvenueData,
  decryptCcAvenueData,
} = require("../config/pgConfig");

const secretKey = "TEST_CARD91_CSCI";
let storeSessionId = "";

exports.razorpayInitiate = async (req, res) => {
  const { cscRequest, sessionId } = req.body;

  const decryptedData = decryptCcAvenueData(cscRequest, secretKey);
  const reqData = decryptedData.length > 0 ? JSON.parse(decryptedData) : {};

  if (sessionId.length > 0) {
    storeSessionId = sessionId;
  }

  const {
    amount,
    name,
    email,
    phone,
    txnRefId,
    customerOrgId,
    narration,
    productInfo,
  } = reqData.payload;
  const { authToken, pgName, redirectUrl } = reqData.config;

  // Validate required fields
  if (!name || !email || !phone || !amount || !txnRefId) {
    return res.status(400).json({
      success: false,
      error: "Missing required fields",
    });
  }

  const authHeader =
    "Basic " +
    base64.encode(
      `${razorpayConfig.razorpay_key_id}:${razorpayConfig.razorpay_key_secret}`
    );

  const orderPayload = {
    amount: amount, // in paise
    currency: "INR",
    receipt: txnRefId,
    notes: {
      name: name,
      email: email,
      phone: phone,
      narretion: narration,
      productInfo: productInfo,
      customerOrgId: customerOrgId,
    },
  };

  try {
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      body: JSON.stringify(orderPayload),
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    const finalResponse = {
      razorpayAmount: data.amount,
      currency: "INR",
      firstName: name,
      email: email,
      phone: phone,
      productInfo: productInfo,
      customerOrgId: customerOrgId,
      narration: narration,
      surl: `http://localhost:5000/api/v1/razorpay/verify/${data.id}`,
      key: razorpayConfig.razorpay_key_id,
      transactionId: data.id,
      authKey: authToken,
      pgName: pgName,
      redirectUrl: redirectUrl,
    };

    res.json({
      success: true,
      data: { pgData: encryptCcAvenueData(finalResponse, storeSessionId) },
    });
  } catch (error) {
    console.error(
      "Order creation failed:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to create Razorpay order" });
  }
};

exports.razorpayVerify = async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
    req.body;

  const payload = `${razorpay_order_id}|${razorpay_payment_id}`;

  const generated_signature = crypto
    .createHmac("sha256", razorpayConfig.razorpay_key_secret)
    .update(payload)
    .digest("hex");

  if (razorpay_signature === generated_signature) {
    res.redirect(`http://localhost:3000/payment/success/${razorpay_order_id}`);
  } else {
    res.redirect(`http://localhost:3000/payment/failure/${razorpay_order_id}`);
  }
};
