
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface Material {
    id: string;
    itemName: string;
    materialsName: string;
    qty: string;
    username: string;

}

interface MaterialUseState {
    materials: Material[];
}

const initialState: MaterialUseState = {
    materials: []
};

export const reItemMakingSlice = createSlice({
    name: 'reItemMaterialUse',
    initialState,
    reducers: {
        // Add multiple materials
        // addProductMaterials: (state, action: PayloadAction<Material[]>) => {
        //     state.materials = [...state.materials, ...action.payload];
        // },

        addProductMaterials: (state, action: PayloadAction<Material[]>) => {
            action.payload.forEach((newMaterial) => {
                const existingMaterial = state.materials.find(
                    (material) =>
                        material.itemName === newMaterial.itemName &&
                        material.materialsName === newMaterial.materialsName
                );
                
                if (existingMaterial) {
                    // Add quantity if both itemName and materialsName match
                    existingMaterial.qty = (
                        parseFloat(existingMaterial.qty) + parseFloat(newMaterial.qty)
                    ).toString();
                } else {
                    // Add new material if no match is found
                    state.materials.push(newMaterial);
                }
            });
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

export const { addProductMaterials, deleteMaterial, deleteAllMaterials } = reItemMakingSlice.actions;

export default reItemMakingSlice.reducer;
