const CryptoJS = require("crypto-js");
const crypto = require("crypto");
const { PayData } = require("../../payu.config");

const secretKey = "TEST_CARD91_CSCI";

let storeSessionId = "";

const encryptData = (data, sessionVlaue) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), sessionVlaue).toString();
};

exports.pgDataValidation = async (req, res) => {
  const { pgData, sessionId } = req.body;

  const decryptedData = CryptoJS.AES.decrypt(pgData, secretKey).toString(
    CryptoJS.enc.Utf8
  );
  const reqData = decryptedData.length > 0 ? JSON.parse(decryptedData) : {};

  if (sessionId.length > 0) {
    storeSessionId = sessionId;
  }

  console.log("reqData----->", reqData.payload);

  const txn_id = "PAYU_MONEY_" + Math.floor(Math.random() * 8888888);
  const { amount, productInfo, name, email, phone } = reqData.payload;

  const hashString = [
    PayData.payu_key,
    txn_id,
    amount,
    productInfo,
    name,
    email,
    "",
    "",
    "",
    "",
    "", // udf1 to udf5
    "",
    "",
    "",
    "",
    "", // udf6 to udf10
    PayData.payu_salt,
  ].join("|");

  const hash = crypto.createHash("sha512").update(hashString).digest("hex");

  const payUData = {
    key: PayData.payu_key,
    txnid: txn_id,
    amount: amount,
    currency: "INR",
    productInfo: productInfo,
    name: name,
    email: email,
    phone: phone,
    surl: `http://localhost:5000/api/v1/pg/verify-payment/${txn_id}`,
    furl: `http://localhost:5000/api/v1/pg/verify-payment/${txn_id}`,
    hash: hash,
  };

  // const payUData = {
  //   key: PayData.payu_key,
  //   txnid: txn_id,
  //   amount: amount,
  //   currency: "INR",
  //   productInfo: productInfo,
  //   name: name,
  //   email: email,
  //   phone: phone,
  //   surl: `http://localhost:3000/payment/success/${txn_id}`,
  //   furl: `http://localhost:3000/payment/failure/${txn_id}`,
  //   hash: hash,
  // };

  const data = {
    config: reqData.config,
    data: payUData,
  };

  try {
    res.status(200).json({
      message: "Data validated successfully",
      data: encryptData(data, storeSessionId),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.verifyPaymentStatus = async (req, res) => {
  const { txnid } = req.params;
  const data = await PayData.payuClient.verifyPayment(txnid);
  const verified_data = data.transaction_details[txnid];
  if (verified_data.status === "success") {
    // res.redirect(`https://csc-pg.qual.card91.in/payment/success/${txnid}`);
    res.redirect(`http://localhost:3000/payment/success/${txnid}`);
  } else {
    // res.redirect(`https://csc-pg.qual.card91.in/payment/failure/${txnid}`);
    res.redirect(`http://localhost:3000/payment/failure/${txnid}`);
  }
};

exports.getPaymentStatus = async (req, res) => {
  const verified_data = await PayData.payuClient.verifyPayment(
    req.params.txnid
  );
  const data = verified_data.transaction_details[req.params.txnid];
  console.log("data----->", data);
  res.send({
    status: data.status,
    amount: data.amt,
    txnid: data.txnid,
    method: data.mode,
    error: data.error_Message,
    created_at: new Date(data.addedon).toLocaleString(),
  });
};

exports.generateHashForPayU = async (req, res) => {
  try {
    const { key, txnid, amount, firstname, email, productinfo } = req.body;

    const salt = "TuxqAugd"; // Replace with your real PayU salt (keep secure)

    const hashString = [
      key,
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      "",
      "",
      "",
      "",
      "", // udf1 to udf5
      "",
      "",
      "",
      "",
      "", // udf6 to udf10
      salt,
    ].join("|");

    const hash = crypto.createHash("sha512").update(hashString).digest("hex");

    res.status(200).json({ hash });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate hash" });
  }
};

exports.getPayments = async (req, res) => {
  try {
    const txn_id = "PAYU_MONEY_" + Math.floor(Math.random() * 8888888);
    // const { amount, productinfo, firstname, email, phone } = req.body;
    const amount = 100;
    const productinfo = "Test Product";
    const firstname = "Sachin Singh";
    const email = "test@gmail.com";
    const phone = 1212121212;

    let udf1 = "";
    let udf2 = "";
    let udf3 = "";
    let udf4 = "";
    let udf5 = "";

    const hashString = `${PayData.payu_key}|${txn_id}|${amount}|${productinfo}|${firstname}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}|||||||${PayData.payu_salt}`;
    const hash = crypto.createHash("sha512").update(hashString).digest("hex");

    const data = await PayData.payuClient.paymentInitiate({
      isAmountFilledByCustomer: false,
      txnid: txn_id,
      amount: amount,
      currency: "INR",
      productinfo: productinfo,
      firstname: firstname,
      email: email,
      phone: phone,
      surl: `http://localhost:5000/api/v1/pg/verify/success/${txn_id}`,
      furl: `http://localhost:5000/api/v1/pg/verify/failed/${txn_id}`,
      hash: hash,
    });
    res.send(data);
  } catch (error) {
    res.status(400).send({
      msg: error.message,
      stack: error.stack,
    });
  }
};

exports.verifyStatus = async (req, res) => {
  const verified_data = await PayData.payuClient.verifyPayment(
    req.params.txnid
  );
  const data = verified_data.transaction_details[req.params.txnid];
  res.send({
    status: data.status,
    amount: data.amt,
    txnid: data.txnid,
    method: data.mode,
    error: data.error_Message,
    created_at: new Date(data.addedon).toLocaleString(),
  });
};
