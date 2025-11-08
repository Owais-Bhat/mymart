import {createSlice} from '@reduxjs/toolkit';

const generateOrderId = () => {
  return `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const initialState = {
  orders: [],
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    createOrder: (state, action) => {
      const {items, totalPrice} = action.payload;
      const newOrder = {
        id: generateOrderId(),
        items: items.map((item) => ({
          ...item,
          productId: item.id,
        })),
        totalPrice,
        status: 'pending',
        createdAt: new Date().toISOString(),
        estimatedDelivery: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        ).toISOString(), // 7 days from now
        tracking: {
          current: 'order_placed',
          steps: [
            {id: 'order_placed', label: 'Order Placed', completed: true, date: new Date().toISOString()},
            {id: 'confirmed', label: 'Order Confirmed', completed: false, date: null},
            {id: 'processing', label: 'Processing', completed: false, date: null},
            {id: 'shipped', label: 'Shipped', completed: false, date: null},
            {id: 'out_for_delivery', label: 'Out for Delivery', completed: false, date: null},
            {id: 'delivered', label: 'Delivered', completed: false, date: null},
          ],
        },
      };
      state.orders.unshift(newOrder);
    },
    updateOrderStatus: (state, action) => {
      const {orderId, status} = action.payload;
      const order = state.orders.find((o) => o.id === orderId);
      if (order) {
        order.status = status;
        // Update tracking steps
        const stepIndex = order.tracking.steps.findIndex((s) => s.id === status);
        if (stepIndex >= 0) {
          order.tracking.steps[stepIndex].completed = true;
          order.tracking.steps[stepIndex].date = new Date().toISOString();
          order.tracking.current = status;
        }
      }
    },
    cancelOrder: (state, action) => {
      const orderId = action.payload;
      const order = state.orders.find((o) => o.id === orderId);
      if (order) {
        order.status = 'cancelled';
      }
    },
  },
});

export const {createOrder, updateOrderStatus, cancelOrder} = ordersSlice.actions;

// Selectors
export const selectOrders = (state) => state.orders.orders;

export const selectOrderById = (state, orderId) => {
  return state.orders.orders.find((order) => order.id === orderId);
};

export default ordersSlice.reducer;

