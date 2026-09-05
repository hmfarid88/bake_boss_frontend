import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface OrderItem {
    id: string;
    productId: string;
    category: string;
    productName: string;
    costPrice: number;
    saleRate: number;
    stockRate: number;
    productQty: number;
    discount: number;
    tempRemain: number;
}

export interface Order {
    orderId: string;
    username: string;
    createdAt: string;
    tableNo: string;
    items: OrderItem[];
}

interface OrderState {
    orders: Order[];
}

const initialState: OrderState = {
    orders: [],
};

const orderSlice = createSlice({
    name: "orders",
    initialState,

    reducers: {

        createOrder: (
            state,
            action: PayloadAction<{
                orderId: string;
                username: string;
                createdAt: string;
                tableNo: string;
            }>
        ) => {
            state.orders.push({
                orderId: action.payload.orderId,
                username: action.payload.username,
                createdAt: action.payload.createdAt,
                tableNo: action.payload.tableNo,
                items: [],
            });
        },


        addItemToOrder: (
            state,
            action
        ) => {

            const order =
                state.orders.find(
                    order =>
                        order.orderId ===
                        action.payload.orderId
                );

            if (!order) return;

            const existingItem =
                order.items.find(
                    item =>
                        item.productId ===
                        action.payload.item.productId
                );

            if (existingItem) {

                existingItem.productQty +=
                    action.payload.item.productQty;

            } else {

                order.items.push(
                    action.payload.item
                );

            }

        },

        increaseItemQty: (
            state,
            action: PayloadAction<{
                orderId: string;
                itemId: string;
            }>
        ) => {
            const order = state.orders.find(
                o => o.orderId === action.payload.orderId
            );

            const item = order?.items.find(
                i => i.id === action.payload.itemId
            );

            if (!item) return;

            if (item.productQty < item.tempRemain) {
                item.productQty += 1;
            }
        },

        decreaseItemQty: (
            state,
            action: PayloadAction<{
                orderId: string;
                itemId: string;
            }>
        ) => {
            const order = state.orders.find(
                o => o.orderId === action.payload.orderId
            );

            const item = order?.items.find(
                i => i.id === action.payload.itemId
            );

            if (!item) return;

            item.productQty -= 1;

            if (item.productQty <= 0) {
                order!.items = order!.items.filter(
                    i => i.id !== action.payload.itemId
                );
            }
        },

        updateItemQty: (
            state,
            action: PayloadAction<{
                orderId: string;
                itemId: string;
                qty: number;
            }>
        ) => {
            const order = state.orders.find(
                o => o.orderId === action.payload.orderId
            );

            const item = order?.items.find(
                i => i.id === action.payload.itemId
            );

            if (!item) return;

            if (action.payload.qty <= 0) {
                item.productQty = 0;
                return;
            }

            if (action.payload.qty <= item.tempRemain) {
                item.productQty = action.payload.qty;
            }
        },

        updateItemDiscount: (
            state,
            action: PayloadAction<{
                orderId: string;
                itemId: string;
                discount: number;
            }>
        ) => {
            const order = state.orders.find(
                o => o.orderId === action.payload.orderId
            );

            const item = order?.items.find(
                i => i.id === action.payload.itemId
            );

            if (!item) return;

            item.discount = Math.max(0, action.payload.discount);
        },

        deleteItemFromOrder: (
            state,
            action: PayloadAction<{
                orderId: string;
                itemId: string;
            }>
        ) => {
            const order = state.orders.find(
                o => o.orderId === action.payload.orderId
            );

            if (!order) return;

            order.items = order.items.filter(
                item => item.id !== action.payload.itemId
            );
        },

        deleteOrder: (
            state,
            action: PayloadAction<string>
        ) => {
            state.orders = state.orders.filter(
                order => order.orderId !== action.payload
            );
        },

        clearOrderItems: (
            state,
            action: PayloadAction<string>
        ) => {
            const order = state.orders.find(
                o => o.orderId === action.payload
            );

            if (order) {
                order.items = [];
            }
        },

        updateTableNo: (state, action) => {

            const { orderId, tableNo } = action.payload;

            const order = state.orders.find(
                order => order.orderId === orderId
            );

            if (order) {
                order.tableNo = tableNo;
            }

        },
    },
});

export const {
    createOrder,
    addItemToOrder,
    increaseItemQty,
    decreaseItemQty,
    updateItemQty,
    updateItemDiscount,
    deleteItemFromOrder,
    deleteOrder,
    clearOrderItems,
    updateTableNo,
} = orderSlice.actions;

export default orderSlice.reducer;