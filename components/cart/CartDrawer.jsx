import React, { useEffect } from "react";
import { useRouter } from "next/router";

export default function CartDrawer({
  open,
  onClose,
  cart,
  changeQty,
  removeFromCart,
  total,
  t = (k) => k,
}) {
  const router = useRouter();
  const formatPrice = (p) => `₹${Number(p).toLocaleString()}`;

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape" && open) onClose(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const items = cart.items || [];

  return (
    <>
      {/* Overlay */}
      <div className="ge-cart-overlay" onClick={onClose} />

      {/* Drawer */}
      <div className="ge-cart">
        {/* Header */}
        <div className="ge-cart__header">
          <h3>
            <i className="fas fa-shopping-bag"></i>
            {t("yourCart") || "Your Cart"}
            {items.length > 0 && (
              <span className="ge-cart__badge">{items.length}</span>
            )}
          </h3>
          <button className="ge-cart__close" onClick={onClose} aria-label="Close cart">
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Body */}
        <div className="ge-cart__body">
          {items.length === 0 ? (
            <div className="ge-cart__empty">
              <i className="fas fa-shopping-bag"></i>
              <p>{t("cartEmpty") || "Your cart is empty"}</p>
              <button className="ge-cart__browse" onClick={onClose}>
                Browse Plants
              </button>
            </div>
          ) : (
            <div className="ge-cart__items">
              {items.map((item) => (
                <div key={item._id} className="ge-cart__item">
                  {item.plant?.image && (
                    <img
                      src={item.plant.image}
                      alt={item.plant.name}
                      className="ge-cart__item-img"
                    />
                  )}
                  <div className="ge-cart__item-info">
                    <strong>{item.plant?.name}</strong>
                    <span className="ge-cart__item-price">
                      {formatPrice(item.plant?.price)}
                    </span>
                  </div>
                  <div className="ge-cart__item-qty">
                    <button
                      onClick={() => changeQty(item._id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <i className="fas fa-minus"></i>
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => changeQty(item._id, item.quantity + 1)}>
                      <i className="fas fa-plus"></i>
                    </button>
                  </div>
                  <div className="ge-cart__item-subtotal">
                    {formatPrice((item.plant?.price || 0) * item.quantity)}
                  </div>
                  <button
                    className="ge-cart__item-remove"
                    onClick={() => removeFromCart(item._id)}
                    aria-label="Remove item"
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="ge-cart__footer">
            <div className="ge-cart__total">
              <span>{t("total") || "Total"}</span>
              <strong>{formatPrice(total)}</strong>
            </div>
            <button
              className="ge-cart__checkout"
              onClick={() => { onClose(); router.push("/checkout"); }}
            >
              Checkout <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        )}
      </div>
    </>
  );
}
