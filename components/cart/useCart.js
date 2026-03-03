// components/cart/useCart.js
import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

export default function useCart() {
  const { getAuthHeaders } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [open, setOpen] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!getAuthHeaders().Authorization) return setCart({ items: [] });
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart`,
        { headers: getAuthHeaders() }
      );
      setCart(res.data);
    } catch {
      setCart({ items: [] });
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = useCallback(
    async (plantOrId, quantity = 1) => {
      if (!getAuthHeaders().Authorization) throw new Error("LOGIN_REQUIRED");
      const plantId = typeof plantOrId === "string" ? plantOrId : plantOrId._id;
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart`,
        { plantId, quantity },
        { headers: getAuthHeaders() }
      );
      await fetchCart();
      setOpen(true);
    },
    [getAuthHeaders, fetchCart]
  );

  const removeFromCart = useCallback(
    async (itemId) => {
      if (!getAuthHeaders().Authorization) return;
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart/${itemId}`,
        { headers: getAuthHeaders() }
      );
      await fetchCart();
    },
    [getAuthHeaders, fetchCart]
  );

  const changeQty = useCallback(
    async (itemId, newQty) => {
      if (!getAuthHeaders().Authorization || newQty < 1) return;
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/cart/${itemId}`,
        { quantity: newQty },
        { headers: getAuthHeaders() }
      );
      await fetchCart();
    },
    [getAuthHeaders, fetchCart]
  );

  const cartCount = useMemo(
    () => cart.items?.reduce((s, i) => s + i.quantity, 0) || 0,
    [cart]
  );

  const total = useMemo(
    () =>
      cart.items?.reduce((s, i) => s + (i.plant?.price || 0) * i.quantity, 0) ||
      0,
    [cart]
  );

  return {
    cart,
    cartCount,
    total,
    open,
    setOpen,
    addToCart,
    removeFromCart,
    changeQty,
    refresh: fetchCart,
  };
}
