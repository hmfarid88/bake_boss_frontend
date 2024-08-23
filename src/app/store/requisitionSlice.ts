import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import swal from 'sweetalert';


interface Product {
    id: string;
    date: string;
    productName: string;
    productQty: number;
    status: string,
    username: string
}
interface requisitionProductState {
    products: Product[];
}

const initialState: requisitionProductState = {
    products: [],
};

export const requisitionProductSlice = createSlice({
    name: "requisitionProduct",
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

        deleteProduct: (state, action) => {
            const id = action.payload;
            state.products = state.products.filter((product) => product.id !== id);
        },
        deleteAllProducts: (state) => {
            state.products = [];
        },
    }

})
export const { addProducts, deleteProduct, deleteAllProducts } = requisitionProductSlice.actions;

export default requisitionProductSlice.reducer;