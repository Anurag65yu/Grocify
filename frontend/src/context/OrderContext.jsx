import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiFetch, API_ENABLED, normalizeOrder } from '../api/client';
import { useAuth } from './AuthContext';

export const OrderContext = createContext(null);

const ORDERS_KEY = 'grocify_orders';
const STATUS_FLOW = ['pending', 'packed', 'shipped', 'out_for_delivery', 'delivered'];

function loadOrders() {
  try { return JSON.parse(localStorage.getItem(ORDERS_KEY)) || []; } catch { return []; }
}

export function OrderProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState(() => API_ENABLED ? [] : loadOrders());

  useEffect(() => {
    if (!API_ENABLED) localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (!API_ENABLED) return;
    if (!isAuthenticated) { setOrders([]); return; }
    apiFetch('/api/orders')
      .then(data => setOrders(data.map(normalizeOrder)))
      .catch(() => {});
  }, [isAuthenticated]);

  const placeOrder = async (orderData) => {
    if (API_ENABLED) {
      const items = (orderData.items || []).map(item => ({
        productId: (item._id || item.id)?.toString(),
        quantity: item.quantity,
      }));
      const data = await apiFetch('/api/orders/place', {
        method: 'POST',
        body: JSON.stringify({
          address: orderData.address,
          items,
          couponCode: orderData.couponCode || null,
          discountAmount: orderData.discount || 0,
        }),
      });
      const order = normalizeOrder(data);
      setOrders(prev => [order, ...prev]);
      return order;
    }
    const order = {
      id: `ORD-${Date.now().toString().slice(-8)}`,
      ...orderData,
      deliveryStatus: 'pending',
      paymentStatus: orderData.paymentMethod === 'cod' ? 'pending' : 'paid',
      createdAt: new Date().toISOString(),
      statusHistory: [{ status: 'pending', at: new Date().toISOString(), note: 'Order placed' }],
    };
    setOrders(prev => [order, ...prev]);
    return order;
  };

  const getOrderById = (id) => orders.find(o => o.id === id || o._id === id);
  const getUserOrders = (userId) => orders.filter(o => o.userId === userId || o.user === userId);

  const updateOrderStatus = async (id, deliveryStatus) => {
    if (API_ENABLED) {
      try { await apiFetch(`/api/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ deliveryStatus }) }); } catch {}
    }
    setOrders(prev => prev.map(o => {
      if (o.id !== id && o._id !== id) return o;
      return {
        ...o,
        deliveryStatus,
        statusHistory: [...(o.statusHistory || []), { status: deliveryStatus, at: new Date().toISOString() }],
      };
    }));
  };

  const advanceOrderStatus = (id) => {
    const order = getOrderById(id);
    if (!order || order.deliveryStatus === 'cancelled') return;
    const idx = STATUS_FLOW.indexOf(order.deliveryStatus);
    if (idx === -1 || idx >= STATUS_FLOW.length - 1) return;
    updateOrderStatus(id, STATUS_FLOW[idx + 1]);
  };

  const cancelOrder = (id) => {
    const order = getOrderById(id);
    if (!order) return;
    if (!['pending', 'packed'].includes(order.deliveryStatus)) return;
    updateOrderStatus(id, 'cancelled');
  };

  return (
    <OrderContext.Provider value={{
      orders, placeOrder, getOrderById, getUserOrders,
      updateOrderStatus, advanceOrderStatus, cancelOrder, STATUS_FLOW,
    }}>
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  return useContext(OrderContext);
}
