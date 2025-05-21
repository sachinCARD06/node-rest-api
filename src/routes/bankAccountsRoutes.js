const express = require("express");
const { getBankAccounts } = require("../controllers/bankAccountsController");

const router = express.Router();

router.get("/", getBankAccounts);

module.exports = router;
