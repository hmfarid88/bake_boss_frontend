import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import swal from 'sweetalert';

interface Product {
    id: string;
    date: string;
    category: string;
    materialsName: string;
    materialsQty: string;
    username: string;
    status: string

}

interface MaterialState {
    products: Product[];
}

const initialState: MaterialState = {
    products: [],
};

export const productionStockSlice = createSlice({
    name: "productionStock",
    initialState,
    reducers: {
     
        addMaterials: (state, action: PayloadAction<Product>) => {
            const exist = state.products.find((pro) => pro.materialsName === action.payload.materialsName)
            if (exist) {
                swal("Oops!", "This ingredient is already exist!", "error");
            } else {
                state.products.push(action.payload);
            }
        },

        deleteMaterials: (state, action) => {
            const id = action.payload;
            state.products = state.products.filter((product) => product.id !== id);
        },
        deleteAllMaterials: (state) => {
            state.products = [];
        },
    },
});

export const { addMaterials, deleteMaterials, deleteAllMaterials } = productionStockSlice.actions;

export default productionStockSlice.reducer;