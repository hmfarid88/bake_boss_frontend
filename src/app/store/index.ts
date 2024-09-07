import { combineReducers, configureStore } from "@reduxjs/toolkit";
import productReducer from "../store/productSlice";
import usernameReducer from "../store/usernameSlice";
import productsaleReducer from "../store/productSaleSlice";
import makeItemReducer from "../store/makeItemSlice";
import materialReducer from "../store/materialSlice";
import salesProductSaleReducer from "../store/salesProductSaleSlice";
import damageProductReducer from "../store/damageProducts";
import salesDamageProductReducer from "../store/salesDamageProduct";
import damageMaterialReducer from "../store/damageMaterials";
import requisitionProductReducer from "../store/requisitionSlice";
import materialUseReducer from "../store/materialUseSlice";
import requisitionMaterialsReducer from "../store/requisitionMaterials";
import vendorSaleReducer from "../store/vendorSale";
import reItemMakingReducer from "../store/reItemMakingSlice";

import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';



const rootReducer = combineReducers({
  products: productReducer,
  username: usernameReducer,
  productTosale:productsaleReducer,
  salesProduct:salesProductSaleReducer,
  makeProducts:makeItemReducer,
  materialProducts:materialReducer,
  damageProduct:damageProductReducer,
  salesDamageProduct:salesDamageProductReducer,
  damageMaterials:damageMaterialReducer,
  requisitionProduct:requisitionProductReducer,
  materialUse:materialUseReducer,
  requisitionMaterials:requisitionMaterialsReducer,
  vendorSalesProduct:vendorSaleReducer,
  reItemMaterialUse:reItemMakingReducer
 
});

const persistConfig = {
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});


export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
