"use client";
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import axios from 'axios';
import Seo from '@/components/common/Seo';
import { showNotification } from '@/components/Notification';
import OccasionSelector from '@/components/OccasionSelector';
import { useAuth } from '@/context/AuthContext';

export function getStaticProps({ locale }) {
  return {
    props: {
      messages: require(`../locales/${locale}.json`),
      locale,
    }
  }
}

export default function GiftATreePage() {
  const { getAuthHeaders, isLoggedIn: authLoggedIn, isLoading: authLoading, token } = useAuth();
  const t = useTranslations('giftTree');
  const router = useRouter();
  const carouselRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [plants, setPlants] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userLoading, setUserLoading] = useState(true);

  const [form, setForm] = useState({
    occasion: "",
    numberOfTrees: "1",
    recipientName: "",
    recipientEmail: "",
    recipientPhone: "",
    recipientWhatsapp: "",
    senderName: "",
    senderEmail: "",
    senderPhone: "",
    message: "",
    paymentMethod: "PAYU"
  });

  useEffect(() => {
    if (authLoading) return; // Wait for auth hydration

    if (!authLoggedIn) { setUserLoading(false); return; }

    setIsLoggedIn(true);

    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const userData = response.data;
        setForm((prev) => ({
          ...prev,
          senderName: userData.name || userData.user?.name || "",
          senderEmail: userData.email || userData.user?.email || "",
          senderPhone: userData.phone || userData.user?.phone || "",
        }));
      } catch (error) { setIsLoggedIn(false); }
      setUserLoading(false);
    };
    fetchProfile();
  }, [authLoading, authLoggedIn, token]);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/plants`)
      .then((res) => setPlants(Array.isArray(res.data.plants) ? res.data.plants : []))
      .catch(() => setPlants([]));
  }, []);

  useEffect(() => {
    if (router.isReady) {
      const { occasion, numberOfTrees } = router.query;
      if (occasion || numberOfTrees) {
        setForm(prev => ({ ...prev, occasion: occasion || prev.occasion, numberOfTrees: numberOfTrees || prev.numberOfTrees }));
      }
    }
  }, [router.isReady, router.query]);

  const handleChange = (e) => { const { name, value } = e.target; setForm((prev) => ({ ...prev, [name]: value })); };

  const handleAddProduct = (plant) => {
    const maxTrees = parseInt(form.numberOfTrees);
    if (selectedProducts.length < maxTrees) {
      setSelectedProducts([...selectedProducts, plant]);
      showNotification(`${plant.name} added`, "success");
    }
  };

  const handleRemoveProduct = (index) => {
    setSelectedProducts(selectedProducts.filter((_, i) => i !== index));
  };

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const amt = 260;
      carouselRef.current.scrollTo({
        left: carouselRef.current.scrollLeft + (direction === 'left' ? -amt : amt),
        behavior: 'smooth'
      });
    }
  };

  const subtotal = selectedProducts.reduce((sum, p) => sum + (p.price || 0), 0);
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax;

  const initiatePayUPayment = (payuData) => {
    const requiredFields = ['key', 'txnid', 'hash', 'amount', 'productinfo', 'firstname', 'email', 'surl', 'furl'];
    if (requiredFields.some(f => !payuData[f])) {
      showNotification('Payment initialization failed', 'error');
      setLoading(false);
      return;
    }
    const payuForm = document.createElement('form');
    payuForm.setAttribute('method', 'POST');
    payuForm.setAttribute('action', process.env.NEXT_PUBLIC_PAYU_URL || 'https://test.payu.in/_payment');
    const params = {
      key: payuData.key, txnid: payuData.txnid, amount: String(payuData.amount),
      productinfo: payuData.productinfo, firstname: payuData.firstname, email: payuData.email,
      phone: payuData.phone || '', udf1: payuData.udf1, udf2: payuData.udf2,
      udf3: payuData.udf3 || '', udf4: payuData.udf4 || '', udf5: payuData.udf5 || '',
      surl: payuData.surl, furl: payuData.furl, hash: payuData.hash
    };
    Object.entries(params).forEach(([key, val]) => {
      const input = document.createElement('input');
      input.type = 'hidden'; input.name = key; input.value = val;
      payuForm.appendChild(input);
    });
    document.body.appendChild(payuForm);
    payuForm.submit();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedProducts.length !== parseInt(form.numberOfTrees)) {
      showNotification(`Please select exactly ${form.numberOfTrees} tree(s)`, "error");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/gift-tree`,
        { ...form, products: selectedProducts.map(p => ({ plantId: p._id })) }
      );
      const orderData = response.data.data;
      if (!orderData.payuData) { showNotification('Payment initialization failed', 'error'); setLoading(false); return; }
      setTimeout(() => initiatePayUPayment(orderData.payuData), 100);
    } catch (error) {
      showNotification(error.response?.data?.message || "Failed to send tree gift.", "error");
      setLoading(false);
    }
  };

  const maxTrees = parseInt(form.numberOfTrees);
  const canAddMore = selectedProducts.length < maxTrees;

  return (
    <>
      <Seo
        title="Gift a Tree | GreenEye"
        description="Send a meaningful gift by planting trees in someone's name."
        canonical="https://greeneye.foundation/gift-a-tree"
        siteName="GREENEYE"
      />

      <section className="ge-gift">
        <div className="ge-gift__container">
          {/* Header */}
          <motion.div
            className="ge-gift__header"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <button className="ge-gift__back" onClick={() => router.back()} aria-label="Go back">
              <i className="fas fa-arrow-left"></i>
            </button>
            <div>
              <h1>Gift a Tree</h1>
              <p>A meaningful gift that grows with every occasion</p>
            </div>
          </motion.div>

          <form onSubmit={handleSubmit} className="ge-gift__form">
            {/* Row 1: Occasion + Number */}
            <div className="ge-gift__row ge-gift__row--2col">
              <div className="ge-gift__field">
                <label>Occasion *</label>
                <OccasionSelector value={form.occasion} onChange={handleChange} required />
              </div>
              <div className="ge-gift__field">
                <label htmlFor="numberOfTrees">Number of Trees *</label>
                <select
                  id="numberOfTrees" name="numberOfTrees"
                  value={form.numberOfTrees}
                  onChange={(e) => { handleChange(e); setSelectedProducts([]); }}
                  required
                >
                  <option value="1">1 Tree</option>
                  <option value="2">2 Trees</option>
                  <option value="3">3 Trees</option>
                  <option value="5">5 Trees</option>
                  <option value="10">10 Trees</option>
                </select>
              </div>
            </div>

            {/* Tree Selection */}
            <div className="ge-gift__section">
              <h3>
                Select Trees
                <span className="ge-gift__count">{selectedProducts.length}/{maxTrees}</span>
              </h3>

              <div className="ge-gift__carousel-wrap">
                <button type="button" className="ge-gift__arrow ge-gift__arrow--left" onClick={() => scrollCarousel('left')}><i className="fas fa-chevron-left"></i></button>
                <div className="ge-gift__carousel" ref={carouselRef}>
                  {plants.map((plant) => {
                    const isSelected = selectedProducts.some(p => p._id === plant._id);
                    const isDisabled = !canAddMore && !isSelected;
                    return (
                      <div key={plant._id} className={`ge-gift__plant${isSelected ? ' ge-gift__plant--selected' : ''}${isDisabled ? ' ge-gift__plant--disabled' : ''}`}>
                        {plant.image && (
                          <div className="ge-gift__plant-img">
                            <img src={plant.image} alt={plant.name} />
                          </div>
                        )}
                        <div className="ge-gift__plant-info">
                          <strong>{plant.name}</strong>
                          <span className="ge-gift__plant-price">₹{plant.price}</span>
                        </div>
                        {isSelected ? (
                          <button type="button" className="ge-gift__plant-btn ge-gift__plant-btn--remove"
                            onClick={() => handleRemoveProduct(selectedProducts.findIndex(p => p._id === plant._id))}>
                            <i className="fas fa-check"></i> Selected
                          </button>
                        ) : (
                          <button type="button" className="ge-gift__plant-btn ge-gift__plant-btn--add"
                            onClick={() => handleAddProduct(plant)} disabled={isDisabled}>
                            <i className="fas fa-plus"></i> Add
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
                <button type="button" className="ge-gift__arrow ge-gift__arrow--right" onClick={() => scrollCarousel('right')}><i className="fas fa-chevron-right"></i></button>
              </div>
            </div>

            {/* Recipient */}
            <div className="ge-gift__section">
              <h3><i className="fas fa-user-friends"></i> Recipient</h3>
              <div className="ge-gift__row ge-gift__row--2col">
                <div className="ge-gift__field">
                  <label>Name *</label>
                  <input type="text" name="recipientName" value={form.recipientName} onChange={handleChange} placeholder="Recipient's name" required />
                </div>
                <div className="ge-gift__field">
                  <label>Email *</label>
                  <input type="email" name="recipientEmail" value={form.recipientEmail} onChange={handleChange} placeholder="recipient@email.com" required />
                </div>
              </div>
              <div className="ge-gift__row ge-gift__row--2col">
                <div className="ge-gift__field">
                  <label>Phone *</label>
                  <input type="tel" name="recipientPhone" value={form.recipientPhone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" required />
                </div>
                <div className="ge-gift__field">
                  <label>{t('recipientWhatsapp') || 'WhatsApp'}</label>
                  <input type="tel" name="recipientWhatsapp" value={form.recipientWhatsapp} onChange={handleChange} placeholder="+919876543210" />
                  <small>For tree planting notifications</small>
                </div>
              </div>
            </div>

            {/* Sender */}
            <div className="ge-gift__section">
              <h3><i className="fas fa-user-circle"></i> Your Info</h3>
              <div className="ge-gift__row ge-gift__row--3col">
                <div className="ge-gift__field">
                  <label>Your Name *</label>
                  <input type="text" name="senderName" value={form.senderName} onChange={handleChange} placeholder="Your name" required disabled={isLoggedIn} />
                </div>
                <div className="ge-gift__field">
                  <label>Email</label>
                  <input type="email" name="senderEmail" value={form.senderEmail} onChange={handleChange} placeholder="your@email.com" disabled={isLoggedIn} />
                </div>
                <div className="ge-gift__field">
                  <label>Phone</label>
                  <input type="tel" name="senderPhone" value={form.senderPhone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" disabled={isLoggedIn} />
                </div>
              </div>
            </div>

            {/* Message */}
            <div className="ge-gift__field">
              <label>Personal Message</label>
              <textarea name="message" value={form.message} onChange={handleChange} placeholder="Add a heartfelt message..." rows="3" maxLength="500" />
              <small>{form.message.length}/500</small>
            </div>

            {/* Sticky Bottom Bar */}
            {selectedProducts.length > 0 && (
              <div className="ge-gift__bar">
                <div className="ge-gift__bar-summary">
                  <div className="ge-gift__bar-trees">
                    {selectedProducts.map((p, i) => (
                      <span key={i} className="ge-gift__bar-chip">
                        {p.name}
                        <button type="button" onClick={() => handleRemoveProduct(i)}><i className="fas fa-times"></i></button>
                      </span>
                    ))}
                  </div>
                  <div className="ge-gift__bar-total">
                    <span>₹{subtotal} + ₹{tax} GST</span>
                    <strong>₹{total}</strong>
                  </div>
                </div>
                <button
                  type="submit"
                  className="ge-gift__bar-pay"
                  disabled={loading || selectedProducts.length !== maxTrees}
                >
                  {loading ? (
                    <><i className="fas fa-spinner fa-spin"></i> Processing...</>
                  ) : (
                    <>Pay ₹{total} <i className="fas fa-arrow-right"></i></>
                  )}
                </button>
              </div>
            )}
          </form>
        </div>
      </section>
    </>
  );
}
