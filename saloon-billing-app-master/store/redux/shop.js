import { createSlice } from '@reduxjs/toolkit';

const shopSlice = createSlice({
    name: 'shop',
    initialState: {
        accessToken: '',
        products: [],
        employees: [],
        username: '',
        password: '',
        empPickerItems: []
    },
    reducers: {
        setAccessToken: (state, action) => {
            state.accessToken = action.payload;
        },
        logout: (state) => {
            state.accessToken = '';
            state.products = [];
            state.employees = [];
            state.username = '';
            state.password = '';
        },
        setProducts: (state, action) => {
            state.products = action.payload;
        },
        setUsername: (state, action) => {
            state.username = action.payload;
        },
        setPassword: (state, action) => {
            state.password = action.payload;
        },
        setEmployees: (state, action) => {
            state.employees = action.payload;
        }
    }
});

export default shopSlice.reducer;
export const shopActions = shopSlice.actions;