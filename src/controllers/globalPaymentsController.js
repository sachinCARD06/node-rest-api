const crypto = require("crypto");
const fetch = require("node-fetch");
const { globalPaymentsConfig } = require("../config/globalPayments.config");
const {
  encryptCcAvenueData,
  decryptCcAvenueData,
} = require("../config/pgConfig");

const secretKey = "TEST_CARD91_CSCI";
let storeSessionId = "";

exports.globalPaymentsInitiate = async (req, res) => {
  const { cscRequest, sessionId } = req.body;

  const decryptedData = decryptCcAvenueData(cscRequest, secretKey);
  const reqData = decryptedData.length > 0 ? JSON.parse(decryptedData) : {};

  if (sessionId.length > 0) {
    storeSessionId = sessionId;
  }

  const { amount, name, email, phone, txnRefId } = reqData.payload;
  const { authToken, pgName, redirectUrl } = reqData.config;

  // Validate required fields
  if (!name || !email || !phone || !amount || !txnRefId) {
    return res.status(400).json({
      success: false,
      error: "Missing required fields",
    });
  }

  // Validate field formats
  if (name.length < 3 || name.length > 30) {
    return res.status(400).json({
      success: false,
      error: "Customer name must be between 3-30 characters",
    });
  }

  if (!/^[6-9][0-9]{9}$/.test(phone)) {
    return res.status(400).json({
      success: false,
      error: "Phone number must be 10 digits starting with 6, 7, 8, or 9",
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({
      success: false,
      error: "Invalid email format",
    });
  }

  if (!Number.isInteger(Number(amount)) || Number(amount) <= 0) {
    return res.status(400).json({
      success: false,
      error: "Amount must be a positive integer in Paise",
    });
  }

  // Construct final payload
  const payload = {
    amount: amount,
    callback_url: `http://localhost:5000/api/v1/global-payments/verify/${txnRefId}`,
    cname: name,
    email: email,
    key: globalPaymentsConfig.global_merchant_api_key,
    phone: phone,
    receipt_id: txnRefId,
  };

  // Construct hash string in required order
  const hashString = [
    payload.amount,
    payload.callback_url,
    payload.cname,
    payload.email,
    payload.key,
    payload.phone,
    payload.receipt_id,
    globalPaymentsConfig.global_merchant_salt_key,
  ].join("|");

  // Create SHA-512 hash
  const hash = crypto.createHash("sha512").update(hashString).digest("hex");

  payload.hash = hash;

  try {
    const response = await fetch(
      "https://payments.api.globalpayments.co.in/api/v1/order/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    if (!data.status) {
      return res.status(400).json({
        success: false,
        message: data.error?.message || "Unknown failure",
        code: data.error?.code || null,
      });
    }

    const finalResponse = {
      url: data.url,
      order_id: data.order_id,
      authKey: authToken,
      pgName: pgName,
      redirectUrl: redirectUrl,
    };

    res.json({
      success: true,
      data: { pgData: encryptCcAvenueData(finalResponse, storeSessionId) },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to initiate payment",
      details: error.message || "Unexpected error",
    });
  }
};

exports.globalPaymentsVerify = async (req, res) => {
  const { order_id } = req.body;

  const payload = {
    id: order_id,
    key: globalPaymentsConfig.global_merchant_api_key,
  };

  const hashString = [
    payload.id,
    payload.key,
    globalPaymentsConfig.global_merchant_salt_key,
  ].join("|");

  // Create SHA-512 hash
  const hash = crypto.createHash("sha512").update(hashString).digest("hex");
  payload.hash = hash;

  try {
    const response = await fetch(
      "https://payments.api.globalpayments.co.in/api/v1/order/fetch",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();
    console.log("data---->", data);
    const { order_id, order_status } = data.order;

    if (order_status === "success") {
      res.redirect(`http://localhost:3000/payment/success/${order_id}`);
    } else {
      res.redirect(`http://localhost:3000/payment/failure/${order_id}`);
    }
  } catch (error) {
    res.redirect(`http://localhost:3000/payment/failure/${order_id}`);
  }
};
