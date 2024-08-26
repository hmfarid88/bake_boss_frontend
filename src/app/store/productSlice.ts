import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import swal from 'sweetalert';

interface Product {
    id: string;
    date: string;
    category: string;
    productName: string;
    costPrice: string;
    dpRate: string;
    rpRate: string;
    productQty: string;
    username: string;
    status: string
}

interface ProductState {
    products: Product[];
}

const initialState: ProductState = {
    products: [],
};

export const productSlice = createSlice({
    name: "products",
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
    },
});

export const { addProducts, deleteProduct, deleteAllProducts } = productSlice.actions;

export default productSlice.reducer;



// import { PayloadAction, createSlice } from '@reduxjs/toolkit'
// import swal from 'sweetalert';

// // Define the Product interface
// interface Product {
//     id: string;
//     date: string;
//     category: string;
//     productName: string;
//     costPrice:string;
//     dpRate: string;
//     rpRate: string;
//     productQty: string;
//     username: string;
//     status:string
// }

// // Define the Material interface
// interface Material {
//     id: string;
//     date: string;
//     materialsName: string;
//     materialsRate: number;
//     averageRate: number;
//     materialsQty: number;
//     remainingQty: number;
//     username: string;
//     madeItem: string;
//     status: string
// }

// // Define the state interface for products and materials
// interface ProductState {
//     products: Product[];
//     materials: Material[];
// }

// const initialState: ProductState = {
//     products: [],
//     materials: [],
// };

// // Create the slice
// export const productSlice = createSlice({
//     name: "productMaterials",
//     initialState,
//     reducers: {
//         // Show products
//         showProducts: (state) => state,

//         // Add a product
//         addProducts: (state, action: PayloadAction<Product>) => {
//             const exist = state.products.find((pro) => pro.productName === action.payload.productName);
//             if (exist) {
//                 swal("Oops!", "This Product already exists!", "error");
//             } else {
//                 state.products.push(action.payload);
//             }
//         },

//         // Delete a product and its associated materials
//         deleteProduct: (state, action: PayloadAction<string>) => {
//             const id = action.payload;
//             state.products = state.products.filter((product) => product.id !== id);
//             state.materials = state.materials.filter((material) => material.id !== id);
//         },

//         // Delete all products and their associated materials
//         deleteAllProducts: (state) => {
//             state.products = [];
//             state.materials = [];
//         },

//         // Add material
//         addProductMaterials: (state, action: PayloadAction<Material>) => {
//             state.materials.push(action.payload);
//         },

//         // Delete material
//         deleteProductMaterials: (state, action: PayloadAction<string>) => {
//             const id = action.payload;
//             state.materials = state.materials.filter((material) => material.id !== id);
//         },

//         // Delete all materials associated with a specific product
//         deleteAllProductMaterials: (state, action: PayloadAction<string>) => {
//             const productId = action.payload;
//             state.materials = state.materials.filter(material => material.madeItem !== productId);
//         },
//     },
// });

// // Export the actions
// export const { showProducts, addProducts, deleteProduct, deleteAllProducts, addProductMaterials, deleteProductMaterials, deleteAllProductMaterials } = productSlice.actions;

// // Export the reducer
// export default productSlice.reducer;
