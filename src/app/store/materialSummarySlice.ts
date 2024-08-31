import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store'; 

interface Product {
    id: string;
    category: string;
    productName: string;
    materialsName: string;
    qty: number;
   }

export const selectGroupedMaterialsQty = createSelector(
    (state: RootState) => state.requisitionMaterials.products,
    (products) => {
        return products.reduce((acc, product) => {
            const key = `${product.category}-${product.materialsName}`;
            if (!acc[key]) {
                acc[key] = { ...product, qty: 0 };
            }
            acc[key].qty += product.qty;
            return acc;
        }, {} as Record<string, Product>);
    }
);

export const selectMaterialsQtyList = createSelector(
    selectGroupedMaterialsQty,
    (groupedMaterials) => Object.values(groupedMaterials)
);
