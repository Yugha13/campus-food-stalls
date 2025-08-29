// Import JSON data
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
  "Indian": "https://images.unsplash.com/photo-1563379091339-03246963d29b?w=600&h=400&fit=crop"
};

const foodImages = {
  "Beverages": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop",
  "Pizza": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop", 
  "Burgers": "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop",
  "Momos": "https://images.unsplash.com/photo-1496412705862-e0088f16f791?w=400&h=300&fit=crop",
  "Dosa": "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400&h=300&fit=crop",
  "Snacks": "https://images.unsplash.com/photo-1539252554453-80ab65ce3586?w=400&h=300&fit=crop",
  "Desserts": "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&h=300&fit=crop"
};

// Base templates for generating shops and foods
const shopTemplates = [
  { name: "Cafe Beans", category: "Cafe" },
  { name: "Pizza Corner", category: "Italian" },
  { name: "Burger Hub", category: "American" },
  { name: "Momos Point", category: "Tibetan" },
  { name: "Dosa Center", category: "South Indian" },
  { name: "Noodle House", category: "Chinese" },
  { name: "Sandwich Station", category: "Fast Food" },
  { name: "Biryani Palace", category: "Indian" },
  { name: "Chai Tapri", category: "Beverages" },
  { name: "Ice Cream Corner", category: "Desserts" }
];

const foodsByCategory = {
  "Cafe": ["Cold Coffee", "Cappuccino", "Espresso", "Latte", "Sandwich", "Croissant", "Muffin"],
  "Italian": ["Margherita Pizza", "Pepperoni Pizza", "Pasta", "Lasagna", "Garlic Bread"],
  "American": ["Classic Burger", "Cheese Burger", "Fries", "Onion Rings", "Milkshake"],
  "Tibetan": ["Chicken Momos", "Veg Momos", "Thukpa", "Chowmein", "Fried Rice"],
  "South Indian": ["Plain Dosa", "Masala Dosa", "Idli", "Vada", "Uttapam"],
  "Chinese": ["Fried Rice", "Noodles", "Manchurian", "Spring Rolls", "Soup"],
  "Fast Food": ["Sandwich", "Wrap", "Toast", "Burger", "Fries"],
  "Indian": ["Biryani", "Dal Rice", "Roti", "Curry", "Paratha"]
};

const locations = [
  "Block A, LPU Campus", "Block B, LPU Campus", "Food Court, LPU Campus", 
  "Main Gate, LPU Campus", "Library Area, LPU Campus", "BH1, LPU Campus",
  "BH2, LPU Campus", "GH1, LPU Campus", "GH2, LPU Campus", "Sports Complex, LPU Campus"
];

// Generate 50 shops
const generateShops = () => {
  const shops = [];
  
  for (let i = 1; i <= 50; i++) {
    const templateIndex = (i - 1) % shopTemplates.length;
    const template = shopTemplates[templateIndex];
    const locationIndex = (i - 1) % locations.length;
    const variation = Math.floor((i - 1) / shopTemplates.length) + 1;
    
    shops.push({
      id: i.toString(),
      name: variation > 1 ? `${template.name} ${variation}` : template.name,
      image: categoryImages[template.category] || categoryImages["Cafe"],
      rating: (Math.random() * 1.5 + 3.5).toFixed(1),
      location: locations[locationIndex],
      category: template.category,
      deliveryTime: `${15 + (i % 20)}-${25 + (i % 20)} mins`,
      description: `Quality ${template.category.toLowerCase()} food with fresh ingredients`,
      openHours: "9:00 AM - 10:00 PM",
      contact: `+91 987654${(3000 + i).toString().slice(-4)}`
    });
  }
  
  return shops;
};

// Generate foods (35+ per shop)
const generateFoods = (shops) => {
  const foods = [];
  let foodId = 1;
  
  shops.forEach(shop => {
    const categoryFoods = foodsByCategory[shop.category] || foodsByCategory["Cafe"];
    
    // Generate 35 foods per shop
    for (let i = 0; i < 35; i++) {
      const foodIndex = i % categoryFoods.length;
      const foodName = categoryFoods[foodIndex];
      const variation = Math.floor(i / categoryFoods.length) + 1;
      const finalName = variation > 1 ? `${foodName} ${variation}` : foodName;
      
      const basePrice = 50 + Math.floor(Math.random() * 200);
      const foodCategory = Object.keys(foodImages).find(cat => 
        foodName.toLowerCase().includes(cat.toLowerCase().slice(0, -1))
      ) || "Snacks";
      
      foods.push({
        id: foodId.toString(),
        name: finalName,
        image: foodImages[foodCategory] || foodImages["Snacks"],
        price: basePrice,
        description: `Delicious ${finalName.toLowerCase()} made with fresh ingredients`,
        shop: shop.name,
        shopId: shop.id,
        rating: (Math.random() * 1.5 + 3.5).toFixed(1),
        type: Math.random() > 0.7 ? "non-veg" : "veg",
        category: foodCategory
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