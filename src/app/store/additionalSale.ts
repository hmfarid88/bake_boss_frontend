import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import swal from 'sweetalert';

interface Product {
    id: string;
    date: string;
    category: string;
    productName: string;
    costPrice: number;
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

export const additionalSaleSlice = createSlice({
    name: "additionalSale",
    initialState,
    reducers: {
        showProducts: (state) => state,
        aaddProducts: (state, action: PayloadAction<Product>) => {
            const exist = state.products.find((pro) => pro.productName === action.payload.productName)
            if (exist) {
                swal("Oops!", "This Product is already exist!", "error");
            } else {
                state.products.push(action.payload);
            }

        },

        adeleteProduct: (state, action) => {
            const id = action.payload;
            state.products = state.products.filter((product) => product.id !== id);
        },
        adeleteAllProducts: (state) => {
            state.products = [];
        },
    }

})
export const { showProducts, aaddProducts, adeleteProduct, adeleteAllProducts } = additionalSaleSlice.actions;

export default additionalSaleSlice.reducer;