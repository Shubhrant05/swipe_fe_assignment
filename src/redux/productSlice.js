import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "products",
  initialState: [],
  reducers: {
    addProduct: (state, action) => {
      state.push(action.payload);
    },
    deleteProduct: (state, action) => {
      const updatedState = state[state.length - 1].filter(
        (product) => product.itemId !== action.payload.itemId
      );
      return [...state, updatedState];
    },
    updateProduct: (state, action) => {
      const index = state[state.length - 1].findIndex(
        (product) => product.itemId === action.payload.itemId
      );
      if (index !== -1) {
        state[state.length - 1][index].itemId =  action.payload.itemId;
        state[state.length - 1][index].itemName =  action.payload.updatedProduct.name;
        state[state.length - 1][index].itemPrice =  action.payload.updatedProduct.price;
        state[state.length - 1][index].itemDescription =  action.payload.updatedProduct.description;
        state[state.length - 1][index].itemQuantity =  action.payload.updatedProduct.quantity;
        state[state.length - 1][index].itemPriceInDollar = action.payload.updatedProduct.priceInDollar;
      }
    },
  },
});

export const {
    addProduct,
    deleteProduct,
    updateProduct,
} = productSlice.actions;

export const selectProductList = (state) => state.invoices;

export default productSlice.reducer;
