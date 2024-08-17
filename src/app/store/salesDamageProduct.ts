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
    remainingQty: number;
    status: string,
    username: string
}
interface damageProductState {
    products: Product[];
}

const initialState: damageProductState = {
    products: [],
};

export const damageProductSlice = createSlice({
    name: "salesDamageProduct",
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
export const { addProducts, deleteProduct, deleteAllProducts } = damageProductSlice.actions;

export default damageProductSlice.reducer;