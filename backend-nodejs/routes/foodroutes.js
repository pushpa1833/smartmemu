const express = require("express");
const router = express.Router();
const foodController = require("./controllers/foodcontroller");
const authMiddleware = require("../middlewar/authMiddleware");

// Public
router.get("/", foodController.getAllFood);
router.get("/:id", foodController.getFoodById);

// Protected
router.post("/", authMiddleware, foodController.createFood);
router.put("/:id", authMiddleware, foodController.updateFood);
router.delete("/:id", authMiddleware, foodController.deleteFood);

module.exports = router;
