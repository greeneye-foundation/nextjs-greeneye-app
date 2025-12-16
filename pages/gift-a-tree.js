"use client";
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import axios from 'axios';
import Seo from '@/components/common/Seo';
import { showNotification } from '@/components/Notification';
import OccasionSelector from '@/components/OccasionSelector';

export function getStaticProps({ locale }) {
  return {
    props: {
      messages: require(`../locales/${locale}.json`),
      locale,
    }
  }
}

export default function GiftATreePage() {
  const t = useTranslations('giftTree');
  const router = useRouter();
  const carouselRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [plants, setPlants] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userLoading, setUserLoading] = useState(true);

  const [form, setForm] = useState({
    occasion: "",
    numberOfTrees: "1",
    recipientName: "",
    recipientEmail: "",
    recipientPhone: "",
    senderName: "",
    senderEmail: "",
    senderPhone: "",
    message: "",
    deliveryAddress: {
      street: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
      landmark: ""
    },
    paymentMethod: "COD"
  });

  // Fetch user profile if logged in - FIXED VERSION
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        let token = null;
        if (typeof window !== "undefined") {
          token = localStorage.getItem("authToken");
        }
        
        if (!token) {
          setUserLoading(false);
          return;
        }

        setIsLoggedIn(true);

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/profile`,
          { 
            headers: { 
              Authorization: `Bearer ${token}` 
            } 
          }
        );

        const userData = response.data;

        setForm((prev) => ({
          ...prev,
          senderName: userData.name || userData.user?.name || "",
          senderEmail: userData.email || userData.user?.email || "",
          senderPhone: userData.phone || userData.user?.phone || "",
        }));

        setUserLoading(false);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        setIsLoggedIn(false);
        setUserLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Fetch plants
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/plants`)
      .then((res) => {
        const arr = Array.isArray(res.data.plants) ? res.data.plants : [];
        setPlants(arr);
      })
      .catch((err) => {
        console.error('Failed to fetch plants:', err);
        setPlants([]);
      });
  }, []);

  // Prefill form data from URL params
  useEffect(() => {
    if (router.isReady) {
      const { occasion, numberOfTrees } = router.query;
      if (occasion || numberOfTrees) {
        setForm(prev => ({
          ...prev,
          occasion: occasion || prev.occasion,
          numberOfTrees: numberOfTrees || prev.numberOfTrees,
        }));
      }
    }
  }, [router.isReady, router.query]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      deliveryAddress: {
        ...prev.deliveryAddress,
        [name]: value
      }
    }));
  };

  const handleAddProduct = (plant) => {
    const maxTrees = parseInt(form.numberOfTrees);
    if (selectedProducts.length < maxTrees) {
      setSelectedProducts([...selectedProducts, plant]);
      showNotification(`${plant.name} added to gift`, "success");
    }
  };

  const handleRemoveProduct = (index) => {
    const newProducts = selectedProducts.filter((_, i) => i !== index);
    setSelectedProducts(newProducts);
    showNotification("Product removed from gift", "info");
  };

  // Carousel scroll functions
  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = 300;
      const newScrollPosition = direction === 'left' 
        ? carouselRef.current.scrollLeft - scrollAmount
        : carouselRef.current.scrollLeft + scrollAmount;
      
      carouselRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      });
    }
  };

  // Calculate pricing
  const subtotal = selectedProducts.reduce((sum, p) => sum + (p.price || 0), 0);
  const deliveryCharge = subtotal >= 499 ? 0 : 50;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + deliveryCharge + tax;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (selectedProducts.length !== parseInt(form.numberOfTrees)) {
      showNotification(
        `Please select exactly ${form.numberOfTrees} tree(s)`,
        "error"
      );
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/gift-tree`,
        {
          ...form,
          products: selectedProducts.map(p => ({ plantId: p._id }))
        }
      );

      setOrderDetails(response.data.data);
      setShowOrderSuccess(true);

      showNotification(
        "Tree gift sent successfully!",
        "success"
      );

      // Scroll to success section
      setTimeout(() => {
        document.getElementById('order-success')?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'center'
        });
      }, 300);

    } catch (error) {
      console.error('Order submission error:', error);
      showNotification(
        error.response?.data?.message || "Failed to send tree gift. Please try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const occasionLabels = {
    birthday: "Birthday",
    anniversary: "Anniversary",
    wedding: "Wedding",
    memorial: "Memorial",
    corporate: "Corporate Gift",
    holiday: "Holiday",
    "just-because": "Just Because"
  };

  const maxTrees = parseInt(form.numberOfTrees);
  const canAddMore = selectedProducts.length < maxTrees;

  if (showOrderSuccess && orderDetails) {
    return (
      <>
        <Seo
          title="Order Successful | GreenEye Foundation"
          description="Your tree gift order has been placed successfully"
        />
        
        <section className="order-success-page" id="order-success">
          <div className="container">
            <motion.div
              className="success-card"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="success-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              
              <h1>Order Placed Successfully!</h1>
              <p className="success-message">
                Your tree gift has been sent to {orderDetails.recipientName}
              </p>

              <div className="order-info">
                <div className="info-row">
                  <span className="label">Order ID:</span>
                  <span className="value">{orderDetails.orderId}</span>
                </div>
                <div className="info-row">
                  <span className="label">Order Date:</span>
                  <span className="value">
                    {new Date(orderDetails.orderDate).toLocaleDateString('en-IN')}
                  </span>
                </div>
                <div className="info-row">
                  <span className="label">Payment Method:</span>
                  <span className="value">{orderDetails.paymentMethod}</span>
                </div>
                <div className="info-row">
                  <span className="label">Total Amount:</span>
                  <span className="value total-amount">₹{orderDetails.totalAmount}</span>
                </div>
              </div>

              <div className="products-summary">
                <h3>Selected Trees:</h3>
                <div className="products-grid">
                  {orderDetails.products.map((product, index) => (
                    <div key={index} className="product-mini">
                      {product.image && (
                        <img src={product.image} alt={product.name} />
                      )}
                      <div>
                        <strong>{product.name}</strong>
                        <span>₹{product.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="success-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => router.push('/')}
                >
                  <i className="fas fa-home"></i>
                  Back to Home
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowOrderSuccess(false);
                    setOrderDetails(null);
                    setSelectedProducts([]);
                    setForm({
                      ...form,
                      recipientName: "",
                      recipientEmail: "",
                      recipientPhone: "",
                      message: "",
                      deliveryAddress: {
                        street: "",
                        city: "",
                        state: "",
                        pincode: "",
                        country: "India",
                        landmark: ""
                      }
                    });
                  }}
                >
                  <i className="fas fa-gift"></i>
                  Send Another Gift
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Seo
        title="Gift a Tree | GreenEye Foundation"
        description="Send a meaningful gift by planting trees in someone's name. Perfect for birthdays, anniversaries, and special occasions."
        ogTitle="Gift a Tree | GreenEye Foundation"
        ogDescription="Send a meaningful gift by planting trees in someone's name."
        canonical="https://greeneye.foundation/gift-a-tree"
      />

      <section className="gift-tree-page">
        <div className="container">
          <motion.div
            className="gift-tree-header"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <button
              className="back-button"
              onClick={() => router.push('/')}
              aria-label="Go back to home"
            >
              <i className="fas fa-arrow-left"></i>
            </button>
            <h1>
              <i className="fas fa-gift"></i>
              Complete Your Tree Gift
            </h1>
            <p>Fill in the details below to send a beautiful tree gift</p>
            {userLoading && isLoggedIn && (
              <p style={{ fontSize: '0.9rem', color: '#666' }}>Loading your information...</p>
            )}
          </motion.div>

          <div className="gift-tree-content">
            {/* Summary Card */}
            <motion.div
              className="gift-summary-card"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3>
                <i className="fas fa-clipboard-list"></i>
                Gift Summary
              </h3>
              <div className="summary-item">
                <span className="summary-label">
                  <i className="fas fa-calendar-alt"></i>
                  Occasion:
                </span>
                <span className="summary-value">
                  {form.occasion ? occasionLabels[form.occasion] : "Not selected"}
                </span>
              </div>
              <div className="summary-item">
                <span className="summary-label">
                  <i className="fas fa-tree"></i>
                  Trees to Select:
                </span>
                <span className="summary-value">
                  {selectedProducts.length} / {form.numberOfTrees}
                </span>
              </div>

              {selectedProducts.length > 0 && (
                <div className="selected-products-preview">
                  <h4>Selected Trees:</h4>
                  {selectedProducts.map((product, index) => (
                    <div key={index} className="selected-product-item">
                      {product.image && (
                        <img src={product.image} alt={product.name} />
                      )}
                      <div className="product-info">
                        <strong>{product.name}</strong>
                        <span className="price">₹{product.price}</span>
                      </div>
                      <button
                        className="remove-btn"
                        onClick={() => handleRemoveProduct(index)}
                        title="Remove"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {selectedProducts.length > 0 && (
                <div className="price-breakdown">
                  <h4>Price Breakdown:</h4>
                  <div className="price-row">
                    <span>Subtotal:</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="price-row">
                    <span>Delivery Charge:</span>
                    <span className={deliveryCharge === 0 ? "free" : ""}>
                      {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}
                    </span>
                  </div>
                  {subtotal < 499 && (
                    <div className="free-delivery-note">
                      <i className="fas fa-info-circle"></i>
                      Add ₹{499 - subtotal} more for free delivery
                    </div>
                  )}
                  <div className="price-row">
                    <span>Tax (18% GST):</span>
                    <span>₹{tax}</span>
                  </div>
                  <div className="price-row total">
                    <span>Total Amount:</span>
                    <span>₹{total}</span>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Main Content */}
            <motion.div
              className="gift-form-card"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <form onSubmit={handleSubmit}>
                <div className="form-section">
                  <h3>
                    <i className="fas fa-cog"></i>
                    Gift Details
                  </h3>

                  <div className="form-group occasion-selector-group">
                    <label htmlFor="occasion">Select an Occasion *</label>
                    <OccasionSelector
                      value={form.occasion}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="numberOfTrees">Number of Trees *</label>
                    <select
                      id="numberOfTrees"
                      name="numberOfTrees"
                      value={form.numberOfTrees}
                      onChange={(e) => {
                        handleChange(e);
                        setSelectedProducts([]);
                      }}
                      required
                    >
                      <option value="1">1 Tree</option>
                      <option value="2">2 Trees</option>
                      <option value="3">3 Trees</option>
                      <option value="5">5 Trees</option>
                      <option value="10">10 Trees</option>
                    </select>
                    <i className="fas fa-tree input-icon"></i>
                  </div>
                </div>

                {/* Plant Selection Carousel */}
                <div className="form-section plants-section">
                  <h3>
                    <i className="fas fa-seedling"></i>
                    Select Your Trees ({selectedProducts.length}/{maxTrees})
                  </h3>
                  
                  <div className="carousel-container">
                    <button
                      type="button"
                      className="carousel-arrow left"
                      onClick={() => scrollCarousel('left')}
                      aria-label="Scroll left"
                    >
                      <i className="fas fa-chevron-left"></i>
                    </button>

                    <div className="plants-carousel" ref={carouselRef}>
                      {plants.map((plant) => {
                        const isSelected = selectedProducts.some(p => p._id === plant._id);
                        const isDisabled = !canAddMore && !isSelected;

                        return (
                          <div 
                            key={plant._id} 
                            className={`plant-card ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                          >
                            {plant.image && (
                              <div className="plant-image">
                                <img src={plant.image} alt={plant.name} />
                              </div>
                            )}
                            <h4>{plant.name}</h4>
                            <p className="plant-price">₹{plant.price}</p>
                            <p className="plant-desc">{plant.description || 'Beautiful plant'}</p>
                            
                            {isSelected ? (
                              <button
                                type="button"
                                className="btn-remove"
                                onClick={() => {
                                  const index = selectedProducts.findIndex(p => p._id === plant._id);
                                  handleRemoveProduct(index);
                                }}
                              >
                                <i className="fas fa-check"></i> Selected
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="btn-add"
                                onClick={() => handleAddProduct(plant)}
                                disabled={isDisabled}
                              >
                                <i className="fas fa-plus"></i> Add
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      className="carousel-arrow right"
                      onClick={() => scrollCarousel('right')}
                      aria-label="Scroll right"
                    >
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </div>
                </div>

                <div className="form-section">
                  <h3>
                    <i className="fas fa-user-friends"></i>
                    Recipient Information
                  </h3>

                  <div className="form-group">
                    <label htmlFor="recipientName">Recipient Name *</label>
                    <input
                      type="text"
                      id="recipientName"
                      name="recipientName"
                      value={form.recipientName}
                      onChange={handleChange}
                      placeholder="Who are you gifting to?"
                      required
                    />
                    <i className="fas fa-user input-icon"></i>
                  </div>

                  <div className="form-group">
                    <label htmlFor="recipientEmail">Recipient Email *</label>
                    <input
                      type="email"
                      id="recipientEmail"
                      name="recipientEmail"
                      value={form.recipientEmail}
                      onChange={handleChange}
                      placeholder="recipient@example.com"
                      required
                    />
                    <i className="fas fa-envelope input-icon"></i>
                  </div>

                  <div className="form-group">
                    <label htmlFor="recipientPhone">Recipient Phone *</label>
                    <input
                      type="tel"
                      id="recipientPhone"
                      name="recipientPhone"
                      value={form.recipientPhone}
                      onChange={handleChange}
                      placeholder="+91 XXXXX XXXXX"
                      required
                    />
                    <i className="fas fa-phone input-icon"></i>
                  </div>
                </div>

                <div className="form-section">
                  <h3>
                    <i className="fas fa-map-marker-alt"></i>
                    Delivery Address
                  </h3>

                  <div className="form-group">
                    <label htmlFor="street">Street Address *</label>
                    <input
                      type="text"
                      id="street"
                      name="street"
                      value={form.deliveryAddress.street}
                      onChange={handleAddressChange}
                      placeholder="House no., Street name"
                      required
                    />
                    <i className="fas fa-home input-icon"></i>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="city">City *</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={form.deliveryAddress.city}
                        onChange={handleAddressChange}
                        placeholder="City"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="state">State *</label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={form.deliveryAddress.state}
                        onChange={handleAddressChange}
                        placeholder="State"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="pincode">Pincode *</label>
                      <input
                        type="text"
                        id="pincode"
                        name="pincode"
                        value={form.deliveryAddress.pincode}
                        onChange={handleAddressChange}
                        placeholder="123456"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="country">Country *</label>
                      <input
                        type="text"
                        id="country"
                        name="country"
                        value={form.deliveryAddress.country}
                        onChange={handleAddressChange}
                        placeholder="India"
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="landmark">Landmark (Optional)</label>
                    <input
                      type="text"
                      id="landmark"
                      name="landmark"
                      value={form.deliveryAddress.landmark}
                      onChange={handleAddressChange}
                      placeholder="Near..."
                    />
                    <i className="fas fa-map-pin input-icon"></i>
                  </div>
                </div>

                <div className="form-section">
                  <h3>
                    <i className="fas fa-user-circle"></i>
                    Your Information
                  </h3>

                  <div className="form-group">
                    <label htmlFor="senderName">Your Name *</label>
                    <input
                      type="text"
                      id="senderName"
                      name="senderName"
                      value={form.senderName}
                      onChange={handleChange}
                      placeholder="Your name"
                      required
                      disabled={isLoggedIn}
                      style={isLoggedIn ? { backgroundColor: '#f0f0f0', cursor: 'not-allowed' } : {}}
                    />
                    <i className="fas fa-user-circle input-icon"></i>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="senderEmail">Your Email</label>
                      <input
                        type="email"
                        id="senderEmail"
                        name="senderEmail"
                        value={form.senderEmail}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        disabled={isLoggedIn}
                        style={isLoggedIn ? { backgroundColor: '#f0f0f0', cursor: 'not-allowed' } : {}}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="senderPhone">Your Phone</label>
                      <input
                        type="tel"
                        id="senderPhone"
                        name="senderPhone"
                        value={form.senderPhone}
                        onChange={handleChange}
                        placeholder="+91 XXXXX XXXXX"
                        disabled={isLoggedIn}
                        style={isLoggedIn ? { backgroundColor: '#f0f0f0', cursor: 'not-allowed' } : {}}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Personal Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Add a heartfelt message to your gift..."
                      rows="4"
                      maxLength="500"
                    />
                    <i className="fas fa-comment input-icon"></i>
                  </div>
                </div>

                <div className="form-section">
                  <h3>
                    <i className="fas fa-credit-card"></i>
                    Payment Method
                  </h3>

                  <div className="payment-options">
                    <label className="payment-option">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="COD"
                        checked={form.paymentMethod === 'COD'}
                        onChange={handleChange}
                      />
                      <div className="option-content">
                        <i className="fas fa-money-bill-wave"></i>
                        <span>Cash on Delivery</span>
                      </div>
                    </label>

                    <label className="payment-option">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="ONLINE"
                        checked={form.paymentMethod === 'ONLINE'}
                        onChange={handleChange}
                      />
                      <div className="option-content">
                        <i className="fas fa-credit-card"></i>
                        <span>Online Payment</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => router.push('/')}
                  >
                    <i className="fas fa-arrow-left"></i>
                    <span>Back</span>
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading || selectedProducts.length !== maxTrees}
                  >
                    {loading ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane"></i>
                        <span>Send Gift (₹{total})</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}