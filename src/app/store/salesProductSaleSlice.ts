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
                swal("Oops!", "This Product is already exist!", "error");
            } else {
                state.products.push(action.payload);
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
export const { showProducts, addProducts, deleteProduct, deleteAllProducts } = salesProductSaleSlice.actions;

export default salesProductSaleSlice.reducer;