
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface Material {
    id: string;
    date: string;
    materialsName: string;
    materialsRate: number;
    averageRate: number;
    materialsQty: number;
    remainingQty: number;
    username: string;
    madeItem: string;
    status: string;
}

interface MaterialUseState {
    materials: Material[];
}

const initialState: MaterialUseState = {
    materials: []
};

export const materialUseSlice = createSlice({
    name: 'materialUse',
    initialState,
    reducers: {
        // Add multiple materials
        addProductMaterials: (state, action: PayloadAction<Material[]>) => {
            state.materials = [...state.materials, ...action.payload];
        },

        deleteMaterial: (state, action: PayloadAction<string>) => {
            const id = action.payload;
            state.materials = state.materials.filter((material) => material.id !== id);
        },

        deleteAllMaterials: (state) => {
            state.materials = [];
        },
    },
});

export const { addProductMaterials, deleteMaterial, deleteAllMaterials } = materialUseSlice.actions;

export default materialUseSlice.reducer;
