import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import swal from 'sweetalert';


interface Product {

    id: string;
    date: string;
    materialsName: string;
    averageRate: number;
    materialsQty: number;
    remainingQty: number;
    status: string,
    username: string
}
interface damageMaterialState {
    products: Product[];
}

const initialState: damageMaterialState = {
    products: [],
};

export const damageMaterialSlice = createSlice({
    name: "damageMaterials",
    initialState,
    reducers: {
        addProducts: (state, action: PayloadAction<Product>) => {
            const exist = state.products.find((pro) => pro.materialsName === action.payload.materialsName)
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
export const { addProducts, deleteProduct, deleteAllProducts } = damageMaterialSlice.actions;

export default damageMaterialSlice.reducer;