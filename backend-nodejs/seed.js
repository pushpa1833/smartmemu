const mongoose = require("mongoose");
const Food = require("./models/food");
const User = require("./models/user");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const sampleFoods = [
  {
    name: "Plain Dosa",
    price: 60,
    image: "Dosa.jpeg",
    description: "Crispy fermented rice and lentil crepe",
    availability: true,
    isVeg: true
  },
  {
    name: "Masala Dosa",
    price: 80,
    image: "Dosa.jpeg",
    description: "Crispy dosa with spiced potato filling",
    availability: true,
    isVeg: true
  },
  {
    name: "Idli Sambar",
    price: 50,
    image: "idlis.jpeg",
    description: "Steamed rice cakes with lentil stew",
    availability: true,
    isVeg: true
  },
  {
    name: "Vada",
    price: 30,
    image: "vada.jpeg",
    description: "Crispy lentil donut",
    availability: true,
    isVeg: true
  },
  {
    name: "Samosa",
    price: 25,
    image: "samos.jpeg",
    description: "Crispy pastry with spiced potatoes",
    availability: true,
    isVeg: true
  },
  {
    name: "Onion Pakoda",
    price: 40,
    image: "oninon pakoda.jpeg",
    description: "Crispy onion fritters",
    availability: true,
    isVeg: true
  },
  {
    name: "Onion Samosa",
    price: 30,
    image: "onionsamosa.jpeg",
    description: "Crispy samosa with onion filling",
    availability: true,
    isVeg: true
  },
  {
    name: "Veg Puff",
    price: 35,
    image: "veg puff.jpg",
    description: "Flaky pastry with vegetable filling",
    availability: true,
    isVeg: true
  },
  {
    name: "Egg Puff",
    price: 40,
    image: "egg puff.jpg",
    description: "Flaky pastry with egg filling",
    availability: true,
    isVeg: false
  },
  {
    name: "Tea",
    price: 15,
    image: "tea.jpeg",
    description: "Indian spiced tea",
    availability: true,
    isVeg: true
  },
  {
    name: "Puri Bhaji",
    price: 70,
    image: "puri.jpeg",
    description: "Puffed bread with potato curry",
    availability: true,
    isVeg: true
  },
  {
    name: "Veg Fried Rice",
    price: 120,
    image: "vegrice.jpeg",
    description: "Wok-tossed rice with vegetables",
    availability: true,
    isVeg: true
  },
  {
    name: "Egg Fried Rice",
    price: 130,
    image: "eggrice.jpeg",
    description: "Wok-tossed rice with egg",
    availability: true,
    isVeg: false
  },
  {
    name: "Gobi Fried Rice",
    price: 130,
    image: "gobirice.jpeg",
    description: "Wok-tossed rice with cauliflower",
    availability: true,
    isVeg: true
  },
  {
    name: "Lemon Rice",
    price: 100,
    image: "lemonrice.jpeg",
    description: "Tangy rice with lemon flavor",
    availability: true,
    isVeg: true
  },
  {
    name: "Tomato Rice",
    price: 100,
    image: "Tomatorice.jpeg",
    description: "Flavorful rice with tomato",
    availability: true,
    isVeg: true
  },
  {
    name: "Curd Rice",
    price: 80,
    image: "curedricejpeg.jpeg",
    description: "Rice with yogurt topping",
    availability: true,
    isVeg: true
  },
  {
    name: "Vegetable Sandwich",
    price: 50,
    image: "vegsanwich.jpg",
    description: "Grilled sandwich with vegetables",
    availability: true,
    isVeg: true
  },
  {
    name: "Pani Puri",
    price: 40,
    image: "panipuri.jpeg",
    description: "Crispy puri with flavored water",
    availability: true,
    isVeg: true
  },
  {
    name: "Bajji",
    price: 30,
    image: "bajjijpeg.jpeg",
    description: "Crispy vegetable pakoda",
    availability: true,
    isVeg: true
  },
  {
    name: "Panner Tikka",
    price: 150,
    image: "panner.jpeg",
    description: "Grilled cottage cheese cubes",
    availability: true,
    isVeg: true
  },
  {
    name: "Pongal",
    price: 60,
    image: "Pogal.jpeg",
    description: "Rice and lentil dish with pepper",
    availability: true,
    isVeg: true
  },
  {
    name: "Upma",
    price: 50,
    image: "upma.jpeg",
    description: "Semolina cooked with vegetables",
    availability: true,
    isVeg: true
  },
  {
    name: "Ugani",
    price: 50,
    image: "ugani.jpeg",
    description: "Traditional rice dish",
    availability: true,
    isVeg: true
  },
  {
    name: "Lays (Plain)",
    price: 20,
    image: "bulelays.jpeg",
    description: "Plain potato chips",
    availability: true,
    isVeg: true
  },
  {
    name: "Lays (Tomato)",
    price: 20,
    image: "redlays.jpeg",
    description: "Tomato flavored chips",
    availability: true,
    isVeg: true
  },
  {
    name: "Lays (Green)",
    price: 20,
    image: "greenlays.jpeg",
    description: "Green chili flavored chips",
    availability: true,
    isVeg: true
  },
  {
    name: "Lays (Onion)",
    price: 20,
    image: "onionsamosa.jpeg",
    description: "Onion flavored chips",
    availability: true,
    isVeg: true
  },
  {
    name: "Lays (Black Pepper)",
    price: 20,
    image: "blacklays.jpeg",
    description: "Black pepper flavored chips",
    availability: true,
    isVeg: true
  },
  {
    name: "Lays (Orange)",
    price: 20,
    image: "orglays.jpeg",
    description: "Orange flavored chips",
    availability: true,
    isVeg: true
  },
  {
    name: "Lays (Yellow)",
    price: 20,
    image: "yellolays.jpeg",
    description: "Yellow flavored chips",
    availability: true,
    isVeg: true
  },
  {
    name: "Full Meals",
    price: 150,
    image: "fullmeals.jpeg",
    description: "Complete meal with rice, curry, and sides",
    availability: true,
    isVeg: true
  },
  {
    name: "Full Meals (Non-Veg)",
    price: 180,
    image: "fullmeals2.jpeg",
    description: "Complete meal with chicken curry",
    availability: true,
    isVeg: false
  },
  {
    name: "Mango Ice Cream",
    price: 50,
    image: "mangoicecream.png",
    description: "Creamy mango flavored ice cream",
    availability: true,
    isVeg: true
  },
  {
    name: "Cake",
    price: 60,
    image: "cakepic.png",
    description: "Delicious slice of cake",
    availability: true,
    isVeg: true
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/govindhacanteen");
    console.log("Connected to MongoDB");

    // Clear existing food items
    await Food.deleteMany({});
    console.log("Cleared existing food items");

    // Insert sample foods
    const insertedFoods = await Food.insertMany(sampleFoods);
    console.log(`Inserted ${insertedFoods.length} food items`);

    // Create admin user
    const adminEmail = "puspha480@gmail.com";
    const adminPassword = "hari123";
    
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      const adminUser = new User({
        username: "Admin",
        email: adminEmail,
        password: hashedPassword,
        role: "admin"
      });
      await adminUser.save();
      console.log("Admin user created: puspha480@gmail.com");
    } else {
      console.log("Admin user already exists");
    }

    console.log("Seed completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seedDatabase();
