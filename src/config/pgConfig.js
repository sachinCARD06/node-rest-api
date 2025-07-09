const CryptoJS = require("crypto-js");

exports.encryptCcAvenueData = (payload, key) => {
  const enKey = CryptoJS.enc.Utf8.parse(key);
  const dataStr =
    typeof payload === "string" ? payload : JSON.stringify(payload);

  const encrypted = CryptoJS.AES.encrypt(dataStr, enKey, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });

  return encrypted.toString();
};

exports.decryptCcAvenueData = (payload, key) => {
  const deKey = CryptoJS.enc.Utf8.parse(key);
  const decrypted = CryptoJS.AES.decrypt(payload, deKey, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  }).toString(CryptoJS.enc.Utf8);

  return decrypted.toString(CryptoJS.enc.Utf8);
};
