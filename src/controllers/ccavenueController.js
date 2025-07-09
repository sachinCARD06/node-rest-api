const crypto = require("crypto");
const {
  encryptCcAvenue,
  decryptCcAvenue,
} = require("../config/ccavenueConfig");
const {
  encryptCcAvenueData,
  decryptCcAvenueData,
} = require("../config/pgConfig");

const secretKey = "TEST_CARD91_CSCI";
const ACCESS_CODE = "ATXO66MD43BJ90OXJB";
const MERCHANT_ID = "4249157";
const WORKING_KEY = "142E65A0028313F10CD59C62E6E6210E";

let storeSessionId = "";

exports.ccavenueInitiate = async (req, res) => {
  const { cscRequest, sessionId } = req.body;

  const decryptedData = decryptCcAvenueData(cscRequest, secretKey);
  const reqData = decryptedData.length > 0 ? JSON.parse(decryptedData) : {};

  if (sessionId.length > 0) {
    storeSessionId = sessionId;
  }

  const { amount, name, email, phone } = reqData.payload;
  const { authToken, pgName, redirectUrl } = reqData.config;

  const txnId = "CCAEVENUE" + Math.floor(Math.random() * 8888888);
  const payload = {
    merchant_id: MERCHANT_ID,
    order_id: txnId,
    amount: amount,
    currency: "INR",
    redirect_url: `http://localhost:5000/api/v1/ccavenue/ccavenue-verify/success/${txnId}`,
    cancel_url: `http://localhost:5000/api/v1/ccavenue/ccavenue-verify/failure/${txnId}`,
    billing_name: name,
    billing_email: email,
    billing_phone: phone,
    billing_address: "Test Address",
    billing_city: "Test City",
    billing_state: "Test State",
    billing_zip: "123456",
    billing_country: "IN",
  };

  const payloadString = `merchant_id=${payload.merchant_id}&order_id=${payload.order_id}&amount=${payload.amount}&currency=${payload.currency}&redirect_url=${payload.redirect_url}&cancel_url=${payload.cancel_url}&billing_name=${payload.billing_name}&billing_email=${payload.billing_email}&billing_phone=${payload.billing_phone}&billing_address=${payload.billing_address}&billing_city=${payload.billing_city}&billing_state=${payload.billing_state}&billing_zip=${payload.billing_zip}&billing_country=${payload.billing_country}`;

  var md5 = crypto.createHash("md5").update(WORKING_KEY).digest();
  var keyBase64 = Buffer.from(md5).toString("base64");
  //Initializing Vector and then convert in base64 string
  var ivBase64 = Buffer.from([
    0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b,
    0x0c, 0x0d, 0x0e, 0x0f,
  ]).toString("base64");

  const encrypteCCdData = encryptCcAvenue(payloadString, keyBase64, ivBase64);

  const finalResponse = {
    access_code: ACCESS_CODE,
    encRequest: encrypteCCdData,
    authKey: authToken,
    pgName: pgName,
    redirectUrl: redirectUrl,
  };

  try {
    res.json({
      success: true,
      data: { pgData: encryptCcAvenueData(finalResponse, storeSessionId) },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to initiate payment",
      details: error.message,
    });
  }
};

exports.ccavenueVerify = async (req, res) => {
  const { orderNo, encResp } = req.body;

  var md5 = crypto.createHash("md5").update(WORKING_KEY).digest();
  var keyBase64 = Buffer.from(md5).toString("base64");

  //Initializing Vector and then convert in base64 string
  var ivBase64 = Buffer.from([
    0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b,
    0x0c, 0x0d, 0x0e, 0x0f,
  ]).toString("base64");

  const decryptedData = decryptCcAvenue(encResp, keyBase64, ivBase64);

  // Parse the decrypted response string into an object
  const parsedData = decryptedData.split("&").reduce((acc, pair) => {
    const [key, value] = pair.split("=");
    acc[key] = value || null; // Handle empty values
    return acc;
  }, {});

  try {
    if (parsedData.order_status === "Success") {
      res.redirect(`http://localhost:3000/payment/success/${orderNo}`);
      //   return res.json({
      //     success: true,
      //     message: "Payment processed successfully",
      //     data: { ...parsedData, orderNo },
      //   });
    } else {
      res.redirect(`http://localhost:3000/payment/failure/${orderNo}`);
      //   return res.json({
      //     success: false,
      //     message: "Payment failed",
      //     data: { ...parsedData, orderNo },
      //   });
    }
  } catch (error) {
    return res.status(500).json({
      error: "Failed to process payment response",
      details: error.message,
    });
  }
};
