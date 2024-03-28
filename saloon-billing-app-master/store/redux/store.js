import { configureStore } from "@reduxjs/toolkit";
import billReducer from "./bill";
import shopReducer from "./shop";

const store = configureStore({
    reducer: {
        bill: billReducer,
        shop: shopReducer,
    }
});

export default store;