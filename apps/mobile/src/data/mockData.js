// Import JSON data
// (mockData.json is not strictly needed if we generate everything, but keeping import if used elsewhere)
import mockDataJson from './mockData.json';

// Production-level images for different categories
const categoryImages = {
  "Cafe": "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&h=400&fit=crop",
  "Italian": "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop",
  "American": "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&h=400&fit=crop",
  "Tibetan": "https://images.unsplash.com/photo-1496412705862-e0088f16f791?w=600&h=400&fit=crop",
  "South Indian": "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&h=400&fit=crop",
  "Chinese": "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=400&fit=crop",
  "Fast Food": "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=600&h=400&fit=crop",
  "Indian": "https://images.unsplash.com/photo-1563379091339-03246963d29b?w=600&h=400&fit=crop",
  "Non-Veg": "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&h=400&fit=crop",
  "Desserts": "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=600&h=400&fit=crop",
};

const foodImages = {
  "Beverages": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop",
  "Pizza": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop", 
  "Burgers": "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop",
  "Momos": "https://images.unsplash.com/photo-1496412705862-e0088f16f791?w=400&h=300&fit=crop",
  "Dosa": "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&h=300&fit=crop",
  "Snacks": "https://images.unsplash.com/photo-1539252554453-80ab65ce3586?w=400&h=300&fit=crop",
  "Desserts": "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&h=300&fit=crop",
  "Chicken": "https://images.unsplash.com/photo-1562967914-608f82629710?w=400&h=300&fit=crop",
  "Biryani": "https://images.unsplash.com/photo-1563379091339-03246963d29b?w=400&h=300&fit=crop",
  "Thali": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop"
};

// 15 specific LPU shop templates
const shopTemplates = [
  { name: "Oven Xpress", category: "Non-Veg", isNonVeg: true, location: "Block 34, LPU Campus" },
  { name: "Biryani House", category: "Non-Veg", isNonVeg: true, location: "Main Food Court, LPU Campus" },
  { name: "Rumi's Mashawi", category: "Non-Veg", isNonVeg: true, location: "BH1 Area, LPU Campus" },
  { name: "MB Food Square", category: "Non-Veg", isNonVeg: true, location: "Block 56, LPU Campus" },
  { name: "Shawok", category: "Non-Veg", isNonVeg: true, location: "Near Law Gate, LPU Campus" },
  { name: "N.K Food Court", category: "Indian", isNonVeg: false, location: "Block 56, LPU Campus" },
  { name: "Hangouts", category: "South Indian", isNonVeg: false, location: "Uni Mall, LPU Campus" },
  { name: "Kitchenette", category: "Indian", isNonVeg: false, location: "Block A, LPU Campus" },
  { name: "Nepali Swaad", category: "Chinese", isNonVeg: false, location: "Block 34, LPU Campus" },
  { name: "Yummy Kitchen", category: "Italian", isNonVeg: false, location: "Food Court, LPU Campus" },
  { name: "Cafe Beans", category: "Cafe", isNonVeg: false, location: "Library Area, LPU Campus" },
  { name: "Lovely Sweets", category: "Desserts", isNonVeg: false, location: "Uni Mall, LPU Campus" },
  { name: "Dosa Plaza", category: "South Indian", isNonVeg: false, location: "Block B, LPU Campus" },
  { name: "Sandwich Station", category: "Fast Food", isNonVeg: false, location: "GH1, LPU Campus" },
  { name: "Chai Tapri", category: "Cafe", isNonVeg: false, location: "Sports Complex, LPU Campus" },
];

const foodLists = {
  "Non-Veg": [
    "Chicken Biryani", "Mutton Biryani", "Chicken Tikka", "Butter Chicken", "Chicken Shawarma",
    "Fried Chicken Bucket", "Chicken Burger", "Chicken Wrap", "Non-Veg Thali", "Chicken Wings",
    "Egg Curry", "Chicken Fried Rice", "Chilli Chicken", "Chicken Nuggets", "Tandoori Chicken",
    "Chicken Sandwich", "Chicken Pizza", "Egg Bhurji", "Chicken Momos", "Mutton Kebab"
  ],
  "Indian": [
    "Paneer Butter Masala", "Dal Makhani", "Veg Thali", "Chole Bhature", "Rajma Chawal",
    "Aloo Paratha", "Paneer Paratha", "Mix Veg", "Kadhai Paneer", "Malai Kofta",
    "Jeera Rice", "Naan", "Garlic Naan", "Tandoori Roti", "Lassi",
    "Samosa", "Kachori", "Pav Bhaji", "Puri Sabzi", "Mushroom Masala"
  ],
  "South Indian": [
    "Plain Dosa", "Masala Dosa", "Onion Dosa", "Paneer Dosa", "Cheese Dosa",
    "Idli Sambar", "Medu Vada", "Uttapam", "Upma", "Lemon Rice",
    "Curd Rice", "Filter Coffee", "Mysore Bonda", "Punugulu", "Rava Dosa",
    "Paper Dosa", "Ghee Roast Dosa", "Tomato Uttapam", "Onion Uttapam", "Set Dosa"
  ],
  "Chinese": [
    "Veg Fried Rice", "Hakka Noodles", "Chilli Paneer", "Veg Manchurian", "Spring Rolls",
    "Veg Momos", "Paneer Momos", "Fried Momos", "Honey Chilli Potato", "Chilli Garlic Noodles",
    "Schezwan Noodles", "Schezwan Rice", "Manchow Soup", "Hot & Sour Soup", "Sweet Corn Soup",
    "Veg Chop Suey", "Crispy Corn", "Gobi Manchurian", "Chilli Mushroom", "Singapore Noodles"
  ],
  "Italian": [
    "Margherita Pizza", "Farmhouse Pizza", "Veg Extravaganza", "Cheese Burst Pizza", "Paneer Makhani Pizza",
    "White Sauce Pasta", "Red Sauce Pasta", "Mixed Sauce Pasta", "Baked Pasta", "Lasagna",
    "Garlic Bread", "Cheese Garlic Bread", "Stuffed Garlic Bread", "Bruschetta", "Cheese Dip",
    "Veg Burger", "French Fries", "Peri Peri Fries", "Cheesy Fries", "Potato Wedges"
  ],
  "Cafe": [
    "Cold Coffee", "Hot Coffee", "Cappuccino", "Latte", "Espresso",
    "Mocha", "Frappe", "Iced Tea", "Green Tea", "Masala Chai",
    "Veg Sandwich", "Cheese Sandwich", "Grilled Sandwich", "Club Sandwich", "Paneer Sandwich",
    "Brownie", "Chocolate Muffin", "Blueberry Muffin", "Chocolate Donut", "Croissant"
  ],
  "Fast Food": [
    "Veg Burger", "Cheese Burger", "Paneer Burger", "Aloo Tikki Burger", "Double Patty Burger",
    "Veg Wrap", "Paneer Wrap", "French Fries", "Peri Peri Fries", "Cheese Fries",
    "Veg Sandwich", "Cheese Sandwich", "Cold Coffee", "Lemonade", "Mojito",
    "Oreo Shake", "Kitkat Shake", "Strawberry Shake", "Vanilla Shake", "Chocolate Shake"
  ],
  "Desserts": [
    "Gulab Jamun", "Rasgulla", "Rasmalai", "Kaju Katli", "Jalebi",
    "Motichoor Ladoo", "Besan Ladoo", "Barfi", "Gajar Halwa", "Moong Dal Halwa",
    "Chocolate Ice Cream", "Vanilla Ice Cream", "Butterscotch Ice Cream", "Strawberry Ice Cream", "Mango Ice Cream",
    "Choco Lava Cake", "Black Forest Pastry", "Pineapple Pastry", "Red Velvet Cake", "Brownie with Ice Cream"
  ]
};

// Generate 15 shops exactly
const generateShops = () => {
  return shopTemplates.map((template, index) => {
    return {
      id: (index + 1).toString(),
      name: template.name,
      image: categoryImages[template.category] || categoryImages["Cafe"],
      menuImage: "https://images.unsplash.com/photo-1542861618-2e06a382101b?w=800&h=1200&fit=crop", // Mock menu image
      rating: (Math.random() * 1.0 + 4.0).toFixed(1), // High ratings for top stalls
      location: template.location,
      category: template.category,
      isNonVeg: template.isNonVeg,
      deliveryTime: `${15 + (index % 10)}-${25 + (index % 10)} mins`,
      description: template.isNonVeg ? `Famous non-veg outlet serving delicious meats` : `Quality ${template.category.toLowerCase()} food with fresh ingredients`,
      openHours: "9:00 AM - 10:00 PM",
      contact: `+91 987654${(3000 + index).toString().slice(-4)}`
    };
  });
};

// Generate exactly 20 foods per shop
const generateFoods = (shops) => {
  const foods = [];
  let foodId = 1;
  
  shops.forEach(shop => {
    const categoryFoods = foodLists[shop.category] || foodLists["Cafe"];
    
    // Grab the first 20 items from the category list
    for (let i = 0; i < 20; i++) {
      const foodName = categoryFoods[i];
      
      // Prices strictly ending in 0 or 5
      const basePrice = 50 + Math.floor(Math.random() * 40) * 5;
      
      // Attempt to find a suitable image category, else use Snacks or category default
      const imgKey = Object.keys(foodImages).find(cat => 
        foodName.toLowerCase().includes(cat.toLowerCase().slice(0, -1))
      );
      let foodImage = foodImages["Snacks"];
      if (imgKey) foodImage = foodImages[imgKey];
      else if (shop.category === 'Non-Veg') foodImage = foodImages["Chicken"];
      else if (shop.category === 'Italian') foodImage = foodImages["Pizza"];
      else if (shop.category === 'Cafe') foodImage = foodImages["Beverages"];
      else if (shop.category === 'Indian') foodImage = foodImages["Thali"];
      else if (shop.category === 'Desserts') foodImage = foodImages["Desserts"];
      else if (shop.category === 'South Indian') foodImage = foodImages["Dosa"];
      
      foods.push({
        id: foodId.toString(),
        name: foodName,
        image: foodImage,
        price: basePrice,
        description: `Delicious ${foodName.toLowerCase()} served hot and fresh from ${shop.name}`,
        shop: shop.name,
        shopId: shop.id,
        rating: (Math.random() * 1.2 + 3.8).toFixed(1),
        type: shop.isNonVeg ? (foodName.toLowerCase().includes('veg') ? "veg" : "non-veg") : "veg",
        category: shop.category
      });
      
      foodId++;
    }
  });
  
  return foods;
};

export const allShops = generateShops();
export const allFoods = generateFoods(allShops);

// Helper functions
export const getFoodsByShop = (shopId) => {
  return allFoods.filter(food => food.shopId === shopId);
};

export const getShopById = (shopId) => {
  return allShops.find(shop => shop.id === shopId);
};

export const getFoodById = (foodId) => {
  return allFoods.find(food => food.id === foodId);
};