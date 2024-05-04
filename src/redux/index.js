import { combineReducers } from "@reduxjs/toolkit";
import invoicesReducer from "./invoicesSlice"; // Import your other reducers
import productsReducer from "./productSlice"; 

const rootReducer = combineReducers({
  invoices: invoicesReducer,
  products: productsReducer,
});

export default rootReducer;
