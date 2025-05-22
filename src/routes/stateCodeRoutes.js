const express = require("express");
const router = express.Router();
const { getStateCodeList } = require("../controllers/stateCodeController");

router.get("/", getStateCodeList);

module.exports = router;
