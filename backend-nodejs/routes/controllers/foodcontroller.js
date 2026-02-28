const Food = require("../../models/food");

// Get all food
exports.getAllFood = async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get single food
exports.getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: "Food not found" });
    res.json(food);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Create food
exports.createFood = async (req, res) => {
  try {
    const { name, price, image, description } = req.body;
    const newFood = new Food({ name, price, image, description });
    await newFood.save();
    res.status(201).json(newFood);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update food
exports.updateFood = async (req, res) => {
  try {
    const food = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!food) return res.status(404).json({ message: "Food not found" });
    res.json(food);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete food
exports.deleteFood = async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);
    if (!food) return res.status(404).json({ message: "Food not found" });
    res.json({ message: "Food deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
