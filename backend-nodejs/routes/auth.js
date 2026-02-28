const express = require("express");
const router = express.Router();
const authController = require("./controllers/authcontroller");
const authMiddleware = require("../middlewar/authMiddleware");

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.get("/profile", authMiddleware, authController.profile);
router.put("/profile", authMiddleware, authController.updateProfile);

module.exports = router;
