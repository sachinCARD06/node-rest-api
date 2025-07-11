const PayU = require("payu-websdk");

const payu_key = process.env.MERCHANT_KEY;
const payu_salt = process.env.MERCHANT_SALT;
const payu_environment = process.env.PAYU_ENVIRONMENT;

const payuClient = new PayU(
  {
    key: payu_key,
    salt: payu_salt,
  },
  payu_environment
);

exports.PayData = {
  payuClient,
  payu_key,
  payu_salt,
};
