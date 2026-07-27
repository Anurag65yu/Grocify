import React, { createContext, useContext, useEffect, useState } from "react";

export const OrderContext = createContext(null);

const ORDERS_KEY = "grocify_orders";

const STATUS_FLOW = [
  "pending",
  "packed",
  "shipped",
  "out_for_delivery",
  "delivered",
];

function loadOrders() {
  try {
    return JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
  } catch {
    return [];
  }
}

export function OrderProvider({ children }) {
  const [orders, setOrders] = useState(loadOrders);

  useEffect(() => {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  }, [orders]);

  const placeOrder = (orderData) => {
    const order = {
      id: `ORD-${Date.now().toString().slice(-8)}`,
      ...orderData,
      deliveryStatus: "pending",
      paymentStatus: orderData.paymentMethod === "cod" ? "pending" : "paid",
      createdAt: new Date().toISOString(),
      statusHistory: [
        { status: "pending", at: new Date().toISOString(), note: "Order placed" },
      ],
    };
    setOrders((prev) => [order, ...prev]);
    return order;
  };

  const getOrderById = (id) => orders.find((o) => o.id === id);

  const getUserOrders = (userId) =>
    orders.filter((o) => o.userId === userId);

  const updateOrderStatus = (id, deliveryStatus) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        return {
          ...o,
          deliveryStatus,
          statusHistory: [
            ...(o.statusHistory || []),
            {
              status: deliveryStatus,
              at: new Date().toISOString(),
              note: `Status updated to ${deliveryStatus}`,
            },
          ],
        };
      })
    );
  };

  const advanceOrderStatus = (id) => {
    const order = getOrderById(id);
    if (!order || order.deliveryStatus === "cancelled") return;
    const idx = STATUS_FLOW.indexOf(order.deliveryStatus);
    if (idx === -1 || idx >= STATUS_FLOW.length - 1) return;
    updateOrderStatus(id, STATUS_FLOW[idx + 1]);
  };

  const cancelOrder = (id) => {
    const order = getOrderById(id);
    if (!order) return;
    if (!["pending", "packed"].includes(order.deliveryStatus)) return;
    updateOrderStatus(id, "cancelled");
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        placeOrder,
        getOrderById,
        getUserOrders,
        updateOrderStatus,
        advanceOrderStatus,
        cancelOrder,
        STATUS_FLOW,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrders() {
  return useContext(OrderContext);
}
