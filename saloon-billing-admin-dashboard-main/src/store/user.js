import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        accessToken: '',
        shopData: [],
        employeeData: [],
        products: []
    },
    reducers: {
        setAccessToken: (state, action) => {
            state.accessToken = action.payload;
        },
        setShopData: (state, action) => {
            state.shopData = action.payload;
        },
        setEmplyeeData: (state, action) => {
            state.employeeData = action.payload;
        },
        setProducts: (state, action) => {
            state.products = action.payload;
        },
        logout: (state) => {
            state.accessToken = '';
            state.shopData = [];
        },
    }
});

export default userSlice.reducer;
export const userActions = userSlice.actions;