const crypto = require("crypto");
const {
  encryptCcAvenueData,
  decryptCcAvenueData,
} = require("../config/pgConfig");
const { globalPaymentsConfig } = require("../config/globalPayments.config");

const secretKey = "TEST_CARD91_CSCI";

let storeSessionId = "";

exports.globalPaymentsInitiate = async (req, res) => {
  console.log("globalPaymentsConfig----->", globalPaymentsConfig);
  const formData = req.body || {
    fname: "Test User", // Changed from cname to fname (Page 16)
    email: "test@test.com",
    phone: "9999999999",
    amount: 10000, // Amount in Paise (e.g., 10000 = ₹100)
    receipt_id: `GLOBALPAY_${Math.floor(Math.random() * 8888888)}`,
    callback_url: "https://yourdomain.com/api/v1/global-payments/verify", // Use HTTPS for production
    notes: {
      udf1: "udf field 1",
      udf2: "udf field 2",
      udf3: "udf Field 3", // Corrected to udf3 (Page 16)
      udf4: "udf Field 4", // Corrected to udf4
      udf5: "udf Field 5",
    },
    billing_address: {
      line1: "Lane No One",
      line2: "Street No One",
      city: "city name",
      state: "state name",
      country: "country name",
      zipcode: "422001",
    },
    shipping_address: {
      firstname: "firstname",
      lastname: "lastname",
      phone: "9999999999",
      line1: "Lane No One",
      line2: "Street No One",
      city: "city name",
      state: "state name",
      country: "country name",
      zipcode: "422001",
    },
  };

  // Validate required fields
  if (
    !formData.fname ||
    !formData.email ||
    !formData.phone ||
    !formData.amount ||
    !formData.receipt_id ||
    !formData.callback_url
  ) {
    return res.status(400).json({
      success: false,
      error: "Missing required fields",
    });
  }

  // Validate field formats
  if (formData.fname.length < 3 || formData.fname.length > 30) {
    return res.status(400).json({
      success: false,
      error: "Customer name must be between 3-30 characters",
    });
  }

  if (!/^[6-9][0-9]{9}$/.test(formData.phone)) {
    return res.status(400).json({
      success: false,
      error: "Phone number must be 10 digits starting with 6, 7, 8, or 9",
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    return res.status(400).json({
      success: false,
      error: "Invalid email format",
    });
  }

  if (!Number.isInteger(formData.amount) || formData.amount <= 0) {
    return res.status(400).json({
      success: false,
      error: "Amount must be a positive integer in Paise",
    });
  }

  // Create payload
  const payload = {
    fname: formData.fname,
    phone: formData.phone,
    email: formData.email,
    amount: formData.amount.toString(), // Convert to string as required
    receipt_id: formData.receipt_id,
    key: globalPaymentsConfig.global_merchant_api_key,
    callback_url: formData.callback_url,
    notes: formData.notes,
    billing_address: formData.billing_address,
    shipping_address: formData.shipping_address,
  };

  // Generate hash (Page 13)
  const sortedKeys = Object.keys(payload).sort(); // Sort keys alphabetically
  const hashString =
    sortedKeys
      .map((key) => {
        // Stringify objects for complex fields
        if (["notes", "billing_address", "shipping_address"].includes(key)) {
          return JSON.stringify(payload[key] || {});
        }
        return payload[key];
      })
      .join("|") +
    "|" +
    globalPaymentsConfig.global_merchant_salt_key;

  const hash = crypto.createHash("sha512").update(hashString).digest("hex");
  payload.hash = hash;

  try {
    const response = await fetch(
      "https://payments.api.globalpayments.co.in/api/v1/Order/Create", // Correct endpoint (Page 4)
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.status) {
      return res.status(400).json({
        success: false,
        error: "Payment order creation failed",
        details: data.message || "No error details provided",
      });
    }

    // Decode Base64 URL (Page 4)
    const checkoutUrl = Buffer.from(data.URL, "base64").toString("utf-8");

    res.json({
      success: true,
      data: {
        url: checkoutUrl, // Return decoded URL
        order_id: data.order_id,
      },
    });
  } catch (error) {
    console.error("Payment initiation error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to initiate payment",
      details: error.message || "An unexpected error occurred",
    });
  }
};

exports.globalPaymentsVerify = async (req, res) => {
  //   const { cscRequest, sessionId } = req.body;

  //   const decryptedData = decryptCcAvenueData(cscRequest, secretKey);
  //   const reqData = decryptedData.length > 0 ? JSON.parse(decryptedData) : {};

  return res.json({
    success: true,
    data: "Global Payments verify",
  });
};
