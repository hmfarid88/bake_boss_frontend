import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import swal from 'sweetalert';

interface Product {
    id: string;
    date: string;
    category: string;
    productName: string;
    costPrice: number;
    remainingQty: number;
    saleRate: number;
    discount: number;
    productQty: number;
    status: string;
    username: string;
}

interface SalesProduct {
    products: Product[];
}

const initialState: SalesProduct = {
    products: [],
};

export const salesProductSaleSlice = createSlice({
    name: "salesProduct",
    initialState,
    reducers: {
        showProducts: (state) => state,
        addProducts: (state, action: PayloadAction<Product>) => {
            const exist = state.products.find((pro) => pro.productName === action.payload.productName && pro.username === action.payload.username)
            if (exist) {
                exist.productQty += action.payload.productQty;
            } else {
                state.products.push(action.payload);
            }
        },
        updateDiscount: (state, action) => {
            const { id, discount } = action.payload;
            const product = state.products.find(product => product.id === id);
            if (product) {
                const discountValue = (product.saleRate * product.productQty * discount) / 100;
                product.discount = discountValue;
            }
        },
        deleteProduct: (state, action) => {
            const id = action.payload;
            state.products = state.products.filter((product) => product.id !== id);
        },

        deleteAllProducts: (state, action: PayloadAction<string>) => {
            const username = action.payload;
            state.products = state.products.filter((product) => product.username !== username);
        },
    }

})
export const { showProducts, addProducts, updateDiscount, deleteProduct, deleteAllProducts } = salesProductSaleSlice.actions;

export default salesProductSaleSlice.reducer;