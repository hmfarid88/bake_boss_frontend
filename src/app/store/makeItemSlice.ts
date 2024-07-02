import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import swal from 'sweetalert';

interface Product {
    id: string;
    itemName: string;
    materialsName: string;
    qty: string;
    username: string;

}

interface ItemState {
    products: Product[];
}

const initialState: ItemState = {
    products: [],
};

export const productSlice = createSlice({
    name: "makeProducts",
    initialState,
    reducers: {
        showProducts: (state) => state,
        addItems: (state, action: PayloadAction<Product>) => {
            const exist = state.products.find((pro) => pro.materialsName === action.payload.materialsName)
            if (exist) {
                swal("Oops!", "This ingredient is already exist!", "error");
            } else {
                state.products.push(action.payload);
            }
        },

        deleteItem: (state, action) => {
            const id = action.payload;
            state.products = state.products.filter((product) => product.id !== id);
        },
        deleteAllItems: (state) => {
            state.products = [];
        },
    },
});

export const { showProducts, addItems, deleteItem, deleteAllItems } = productSlice.actions;

export default productSlice.reducer;