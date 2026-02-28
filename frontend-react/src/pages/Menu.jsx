import { useContext, useState } from 'react';
import { CartContext } from '../context/Cartcontext';
import FoodCard from '../components/foodcard.jsx';
import './Menu.css';

function Menu({ search, setSearch }) {
  const { addToCart, cart } = useContext(CartContext);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Snacks', 'Meals', 'Tiffins', 'Juices','Stationery','Desserts'];

  const menuItems = [
    // Snacks
    { name: 'Bajji', price: 10, image: 'bajjijpeg.jpeg', category: 'Snacks', description: 'Crispy spicy pakora', isVeg: true },
    { name: 'Samosa', price: 8, image: 'samos.jpeg', category: 'Snacks', description: 'Triangular pastry with spicy filling', isVeg: true },
    { name: 'Pani Puri', price: 12, image: 'panipuri.jpeg', category: 'Snacks', description: 'Crispy puri with tangy water', isVeg: true },
    { name: 'Onion Samosa', price: 10, image: 'onionsamosa.jpeg', category: 'Snacks', description: 'Samosa with onion filling (4 pieces)', isVeg: true },
    { name: 'Veg Puff', price: 35, image: 'veg puff.jpg', category: 'Snacks', description: 'Crispy pastry filled with spicy mixed vegetables, baked to golden perfection.', isVeg: true },
    { name: 'Egg Puff', price: 20, image: 'egg puff.jpg', category: 'Snacks', description: 'Flaky puff pastry stuffed with a seasoned boiled egg and spicy onion masala.', isVeg: false },
    { name: 'Veg Sandwich',price: 20, image: 'vegsanwich.jpg',category: 'Snacks',description:'Fresh bread layered with vegetables, chutney, and light spices for a quick, tasty snack.',isveg: true},
    { name : 'Tea', price: 15, image: 'tea.jpeg' , category: 'Snacks', description: 'Hot masala tea with cardamom flavor', isVeg: true },
    { name: 'Barbecue Lays', price: 10, image: 'blacklays.jpeg', category: 'Snacks', description: 'Black Lay’s is a crunchy potato chip flavored with rich and spicy pepper seasoning, giving a bold and intense taste ', isVeg: true },
    { name: 'Orange Lays', price: 8, image: 'orglays.jpeg', category: 'Snacks', description: 'Orange flavored potato chips with a tangy taste', isVeg: true },
    { name: 'Green Chilli Lays', price: 12, image: 'greenlays.jpeg', category: 'Snacks', description: 'Green chilli flavored potato chips with a spicy taste', isVeg: true },
    { name: 'Bule Lays', price: 10, image: 'bulelays.jpeg', category: 'Snacks', description: 'Bule flavored potato chips with a mild taste', isVeg: true },
    { name: 'Tomato Tango Lays', price: 35, image: 'redlays.jpeg', category: 'Snacks', description: 'Tomato tango flavored potato chips with a tangy taste', isVeg: true },
    { name: 'Classic Salted', price: 20, image: 'yellolays.jpeg', category: 'Snacks', description: 'Flaky puff pastry stuffed with a seasoned boiled egg and spicy onion masala.', isVeg: false },
    { name: 'Onion Pakoda', price: 12, image: 'oninon pakoda.jpeg', category: 'Snacks', description: 'Crispy onion pakoda with a spicy taste', isVeg: true },
    
    
    // Meals
    { name: 'Lemon Rice', price: 40, image: 'lemonrice.jpeg', category: 'Meals', description: 'Tangy spiced rice with peanuts', isVeg: true },
    { name: 'Egg Rice', price: 40, image: 'eggrice.jpeg', category: 'Meals', description: 'Rice cooked with egg and spices', isVeg: false },
    { name: 'Tomato Rice', price: 40, image: 'Tomatorice.jpeg', category: 'Meals', description: 'Spicy tangy rice with tomatoes', isVeg: true },
    { name: 'Veg Fried Rice', price: 50, image: 'vegrice.jpeg', category: 'Meals', description: 'Fried rice with vegetables', isVeg: true },
    { name: 'Full Meals', price: 120, image: 'fullmeals2.jpeg', category: 'Meals', description: 'Full meal with rice and curry', isVeg: true },
    { name: 'Paneer Rice', price: 60, image: 'panner.jpeg', category: 'Meals', description: 'Simple, savory, and satisfying — paneer fried rice done right', isVeg: true },
    { name: 'Gobi Rice', price: 50, image: 'gobirice.jpeg', category: 'Meals', description: 'Simple, savory, and satisfying — gobi fried rice done right', isVeg: true },


    // Tiffins
    { name: 'Vada', price: 50, image: 'vada.jpeg', category: 'Tiffins', description: 'Crispy lentil fritters', isVeg: true },
    { name: 'Dosa', price: 80, image: 'Dosa.jpeg', category: 'Tiffins', description: 'Crispy South Indian pancake', isVeg: true },
    { name: 'Puri', price: 60, image: 'puri.jpeg', category: 'Tiffins', description: 'Crispy deep fried bread with potato curry', isVeg: true },
    { name: 'Idlis', price: 50, image: 'idlis.jpeg', category: 'Tiffins', description: 'Soft, fluffy idlis that melt in your mouth — comfort on a plate', isVeg: true },
    { name: 'Upma', price: 40, image: 'upma.jpeg', category: 'Tiffins', description: 'Warm, comforting upma — simple flavors that feel like home', isVeg: true },
    { name: 'Ugani Bajji', price: 60, image: 'ugani.jpeg', category: 'Tiffins', description: 'Spicy ugani with crispy bajji — the ultimate Andhra comfort combo', isVeg: true },
    { name: 'Pogal', price: 60, image: 'Pogal.jpeg', category: 'Tiffins', description: 'Creamy, comforting pongal with a drizzle of ghee — pure South Indian bliss', isVeg: true },
    

    
    // Juices
    { name: 'Pineapple Juices', price: 20, image: 'pipleapp.jpeg', category: 'Juices', description: 'Fresh pineapple juice', isVeg: true },
    { name: 'Mango Juices', price: 15, image: 'mango.jpeg', category: 'Juices', description: 'Fresh mango juice', isVeg: true },
    { name: 'Orange Juices', price: 30, image: 'orange.jpeg', category: 'Juices', description: 'Fresh orange juice', isVeg: true },
    { name: 'Watermelon Juices', price: 25, image: 'watermemon.jpeg', category: 'Juices', description: 'Fresh watermelon juice', isVeg: true },
    { name: '7Up', price: 20, image: '7up.jpeg', category: 'Juices', description: 'Refreshing lemon-lime soda', isVeg: true },
    { name : 'Thumsup', price: 20, image: 'tumup.jpeg', category: 'Juices', description: 'Refreshing thumsup soda', isVeg: true },


    // Stationery
    { name: 'A4 Sheets', price: 20, image: 'A4 (1).jpeg', category: 'Stationery', description: 'Premium quality A4 sheets', isVeg: true },
    { name: 'Books', price: 15, image: 'book.jpeg', category: 'Stationery', description: 'Various books for students', isVeg: true },
    { name: 'Eraser', price: 30, image: 'earesjer.jpeg', category: 'Stationery', description: 'High quality eraser for students', isVeg: true },
    { name: 'Sharpener', price: 25, image: 'snapnear.jpeg', category: 'Stationery', description: 'High quality sharpener for students', isVeg: true },
    { name: 'Pencil', price: 10, image: 'pencli.jpeg', category: 'Stationery', description: 'Smooth writing pencil for students', isVeg: true },
    {name : 'Pen', price: 15, image: 'pens.jpeg', category: 'Stationery', description: 'Smooth writing pen for students', isVeg: true },

    //Desserts
    { name: 'Pastry', price: 20, image: 'cakepic.png', category: 'Desserts', description: 'Crispy pastry with sweet filling', isVeg: true },
    { name: 'Mango Ice Cream', price: 30, image: 'mangoicecream.png', category: 'Desserts', description: 'Creamy mango ice cream with nuts', isVeg: true },
    { name: 'Full Cake', price: 25, image: 'fullcake.jpeg', category: 'Desserts', description: 'Sweet, juicy, and summer-ready', isVeg: true },
    { name: 'Cut Fruits', price: 20, image: 'cutfruits.jpeg', category: 'Desserts', description: 'Fresh cut fruits with honey', isVeg: true },
    { name : 'chocolate flavour cone ice cream', price: 20, image: 'coneice.jpeg', category: 'Desserts', description: 'Creamy chocolate cone ice cream with a crispy wafer shell', isVeg: true },
    { name: 'Vanilla cone Ice Cream', price: 20, image: 'venilaicec.jpeg', category: 'Desserts', description: 'Classic vanilla ice cream with a creamy texture', isVeg: true },

    

    
  ];

  // Filter by category first
  const categoryFiltered = activeCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  // Then filter by search query
  const filteredItems = search 
    ? categoryFiltered.filter(item => 
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase())
      )
    : categoryFiltered;

  return (
    <div className="menu-container">
      <h1 className="menu-title">Menu</h1>
      
      {/* Category Tabs */}
      <div className="category-tabs">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-tab ${activeCategory === category ? 'active' : ''}`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Food Items Grid */}
      {filteredItems.length > 0 ? (
        <div className="food-grid">
          {filteredItems.map((item, index) => {
            const cartItem = cart.find(c => c.name === item.name);
            const quantityInCart = cartItem ? cartItem.quantity : 0;
            
            return (
              <FoodCard 
                key={index} 
                name={item.name} 
                price={item.price} 
                image={item.image} 
                description={item.description}
                isVeg={item.isVeg}
                onAddToCart={addToCart}
                quantityInCart={quantityInCart}
              />
            );
          })}
        </div>
      ) : (
        <div className="no-results">
          <p>No food items found for "{search}"</p>
          <button onClick={() => { setActiveCategory('All'); setSearch(''); }} className="clear-search-btn">
            Clear Search
          </button>
        </div>
      )}
    </div>
  );
}

export default Menu;

