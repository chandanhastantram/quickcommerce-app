import { useState } from 'react';
import './App.css';

const PRODUCTS = [
  { id: 1, name: 'Minimal Watch', price: 24999, category: 'accessories', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400' },
  { id: 2, name: 'Leather Bag', price: 41999, category: 'bags', image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400' },
  { id: 3, name: 'Wireless Headphones', price: 16999, category: 'electronics', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400' },
  { id: 4, name: 'Sneakers', price: 12499, category: 'shoes', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400' },
  { id: 5, name: 'Sunglasses', price: 10999, category: 'accessories', image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400' },
  { id: 6, name: 'Backpack', price: 7499, category: 'bags', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400' },
  { id: 7, name: 'Smart Watch', price: 33999, category: 'electronics', image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400' },
  { id: 8, name: 'Running Shoes', price: 14999, category: 'shoes', image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400' },
];

function App() {
  const [view, setView] = useState('home');
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [orderNumber, setOrderNumber] = useState('');
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '', city: '', zip: '',
    cardNumber: '', expiry: '', cvv: ''
  });

  const categories = ['all', 'accessories', 'bags', 'electronics', 'shoes'];

  const filteredProducts = PRODUCTS.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'all' || product.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => 
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, delta) => {
    setCart(cart.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    setCartOpen(false);
    setView('checkout');
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    const orderNum = 'QC' + Math.random().toString(36).substr(2, 9).toUpperCase();
    setOrderNumber(orderNum);
    setView('success');
    setCart([]);
  };

  const handleTrackOrder = () => {
    setView('tracking');
  };

  return (
    <div className="App">
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-left">
          <div className="logo" onClick={() => setView('home')}>QuickCommerce</div>
          <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <div className={`dropdown-menu ${menuOpen ? 'open' : ''}`}>
            <button onClick={() => { setView('home'); setMenuOpen(false); }}>Home</button>
            <button onClick={() => { setView('products'); setMenuOpen(false); }}>Products</button>
            <button onClick={() => { setView('tracking'); setMenuOpen(false); }}>Track Order</button>
          </div>
        </div>
        <div className="nav-circle" onClick={() => setCartOpen(true)}>
          <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
            <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
          </svg>
          {cartCount > 0 && <div className="cart-count">{cartCount}</div>}
        </div>
      </nav>

      {/* Cart Sidebar */}
      <div className={`cart-sidebar ${cartOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h2>Your Cart</h2>
          <button className="close-cart" onClick={() => setCartOpen(false)}>×</button>
        </div>
        
        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🛒</div>
              <p>Your cart is empty</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-item-image" />
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price">₹{item.price.toLocaleString('en-IN')}</div>
                  <div className="quantity-controls">
                    <button className="qty-btn" onClick={() => updateQuantity(item.id, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button className="qty-btn" onClick={() => updateQuantity(item.id, 1)}>+</button>
                  </div>
                </div>
                <button className="remove-item" onClick={() => removeFromCart(item.id)}>×</button>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>Total:</span>
              <span>₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
            <button className="checkout-btn" onClick={handleCheckout}>Checkout</button>
          </div>
        )}
      </div>

      {/* Main Content */}
      {view === 'home' && (
        <section className="hero">
          <div className="hero-content">
            <h1>QuickCommerce</h1>
            <p>Shop smarter, not harder</p>
            <button className="cta-btn" onClick={() => setView('products')}>
              Explore Products
            </button>
          </div>
        </section>
      )}

      {view === 'products' && (
        <section className="products">
          <h2>Products</h2>
          
          <div className="search-bar">
            <input
              type="text"
              className="search-input"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="search-bar">
            {categories.map(cat => (
              <button
                key={cat}
                className={`filter-btn ${activeFilter === cat ? 'active' : ''}`}
                onClick={() => setActiveFilter(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          <div className="product-grid">
            {filteredProducts.map(product => (
              <div key={product.id} className="product-card">
                <img src={product.image} alt={product.name} className="product-image" />
                <div className="product-info">
                  <div className="product-name">{product.name}</div>
                  <div className="product-price">₹{product.price.toLocaleString('en-IN')}</div>
                  <button className="add-to-cart" onClick={() => addToCart(product)}>
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {view === 'checkout' && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Checkout</h2>
            </div>
            <form onSubmit={handlePlaceOrder}>
              <div className="modal-body">
                <h3>Shipping Information</h3>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input type="text" name="name" required value={formData.name} onChange={handleFormChange} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Email *</label>
                    <input type="email" name="email" required value={formData.email} onChange={handleFormChange} />
                  </div>
                  <div className="form-group">
                    <label>Phone *</label>
                    <input type="tel" name="phone" required value={formData.phone} onChange={handleFormChange} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Address *</label>
                  <input type="text" name="address" required value={formData.address} onChange={handleFormChange} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>City *</label>
                    <input type="text" name="city" required value={formData.city} onChange={handleFormChange} />
                  </div>
                  <div className="form-group">
                    <label>ZIP Code *</label>
                    <input type="text" name="zip" required value={formData.zip} onChange={handleFormChange} />
                  </div>
                </div>

                <h3 style={{marginTop: '30px'}}>Payment Information</h3>
                <div className="form-group">
                  <label>Card Number *</label>
                  <input type="text" name="cardNumber" required placeholder="1234 5678 9012 3456" value={formData.cardNumber} onChange={handleFormChange} />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Expiry Date *</label>
                    <input type="text" name="expiry" required placeholder="MM/YY" value={formData.expiry} onChange={handleFormChange} />
                  </div>
                  <div className="form-group">
                    <label>CVV *</label>
                    <input type="text" name="cvv" required placeholder="123" value={formData.cvv} onChange={handleFormChange} />
                  </div>
                </div>

                <div style={{marginTop: '20px', padding: '15px', background: '#f5f5f5'}}>
                  <strong>Order Total: ₹{cartTotal.toLocaleString('en-IN')}</strong>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setView('products')}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Place Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {view === 'success' && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="success-screen">
              <div className="success-icon"></div>
              <h2>Order Placed Successfully!</h2>
              <p className="order-number">Order Number: <strong>{orderNumber}</strong></p>
              <p>Thank you for your purchase. We'll send you a confirmation email shortly.</p>
              <button className="track-order-btn" onClick={handleTrackOrder}>
                Track Your Order
              </button>
              <button className="track-order-btn" style={{marginLeft: '10px', background: 'white', color: 'var(--red)', border: '2px solid var(--red)'}} onClick={() => setView('home')}>
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      )}

      {view === 'tracking' && (
        <div className="tracking-container">
          <div className="tracking-header">
            <h2>Order Tracking</h2>
            <p>Order #{orderNumber}</p>
          </div>

          <div className="timeline">
            <div className="timeline-item completed">
              <div className="timeline-content">
                <div className="timeline-title">Order Placed</div>
                <div className="timeline-time">Today, 2:30 PM</div>
              </div>
            </div>
            <div className="timeline-item completed">
              <div className="timeline-content">
                <div className="timeline-title">Payment Confirmed</div>
                <div className="timeline-time">Today, 2:31 PM</div>
              </div>
            </div>
            <div className="timeline-item active">
              <div className="timeline-content">
                <div className="timeline-title">Processing</div>
                <div className="timeline-time">In Progress</div>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-content">
                <div className="timeline-title">Shipped</div>
                <div className="timeline-time">Pending</div>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-content">
                <div className="timeline-title">Delivered</div>
                <div className="timeline-time">Estimated: 2-3 days</div>
              </div>
            </div>
          </div>

          <div style={{textAlign: 'center', marginTop: '40px'}}>
            <button className="cta-btn" style={{background: 'var(--red)', color: 'white', border: 'none'}} onClick={() => setView('home')}>
              Back to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
