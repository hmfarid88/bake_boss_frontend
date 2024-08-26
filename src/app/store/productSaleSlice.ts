import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import swal from 'sweetalert';


interface Product {
    id: string;
    category: string;
    productName: string;
    costPrice: number;
    dpRate: number;
    rpRate: number;
    productQty: number;
    remainingQty: number;
    status: string,
    username: string
}

interface ProductSaleState {
    products: Product[];
}

const initialState: ProductSaleState = {
    products: [],
};

export const productSaleSlice = createSlice({
    name: "productTosale",
    initialState,
    reducers: {

        addProducts: (state, action: PayloadAction<Product>) => {
            const exist = state.products.find((pro) => pro.productName === action.payload.productName)
            if (exist) {
                swal("Oops!", "This Product is already exist!", "error");
            } else {
                state.products.push(action.payload);
            }

        },
        deleteProduct: (state, action: PayloadAction<string>) => {
            const id = action.payload;
            state.products = state.products.filter((product) => product.id !== id);
        },


        deleteAllProducts: (state) => {
            state.products = [];
        },
    }

})
export const { addProducts, deleteProduct, deleteAllProducts } = productSaleSlice.actions;

export default productSaleSlice.reducer;