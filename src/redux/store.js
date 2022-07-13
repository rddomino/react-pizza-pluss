import { configureStore } from "@reduxjs/toolkit";
import filter from "./slice/filterSlice";
import cart from "./slice/cartSlice";

export const store = configureStore({
    reducer: {
        filter,
        cart
    }
})