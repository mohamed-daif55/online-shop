const express = require("express");
const router = express.Router();

const shopController = require("../controllers/shopController");

router.get("/", shopController.getIndex);

router.post("/", shopController.getIndex);

router.get("/sign-up", shopController.getSignUp);

router.post("/sign-up", shopController.postSignUp);

router.get("/log-in", shopController.getLogin);

router.post("/log-in", shopController.postLoginUser);

router.post("/logout",shopController.postLogout);

router.get("/watches", shopController.getWatches);

router.get("/wallets", shopController.getWallets);

router.get("/back-bags", shopController.getBackBags);

router.get("/account-settings", shopController.getAccountSettings);

router.post("/account-settings", shopController.postAccountSettings);

router.post("/cart-items/:id", shopController.postCartItem);

router.get("/cart-items", shopController.getCartItem);

router.post("/deleteCartItem/:id",shopController.deleteCartItem);

module.exports = router;