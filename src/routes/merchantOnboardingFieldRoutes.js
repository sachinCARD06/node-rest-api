const { Router } = require("express");
const {
  getMerchantOnboardingFieldList,
  getSubCategoriesList,
} = require("../controllers/merchantOnboardingFieldController");

const router = Router();

router.get("/merchant-onboarding-options", getMerchantOnboardingFieldList);
router.get("/sub-categories-options", getSubCategoriesList);

module.exports = router;
