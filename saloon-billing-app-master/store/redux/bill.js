import { createSlice } from '@reduxjs/toolkit';

const billSlice = createSlice({
    name: 'bill',
    initialState: {
        customerName: '',
        phoneNumber: '',
        employeeId: '',
        tip: '',
        discount: '',
        gender: '',
        modeOfPayment: 'cash',
        rating: 0,
        newBillItem: {
            id: '',
            quantity: '',
        },
        billItems: [],
    },
    reducers: {
        setCustomerName: (state, action) => {
            state.customerName = action.payload;
        },
        setPhoneNumber: (state, action) => {
            state.phoneNumber = action.payload;
        },
        setEmployeeId: (state, action) => {
            state.employeeId = action.payload;
        },
        setTip: (state, action) => {
            state.tip = action.payload;
        },
        setDiscount: (state, action) => {
            state.discount = action.payload;
        },
        setRating: (state, action) => {
            state.rating = action.payload;
        },
        setNewBillItemId: (state, action) => {
            state.newBillItem.id = action.payload;
        },
        setNewBillItemQuantity: (state, action) => {
            state.newBillItem.quantity = action.payload;
        },
        setNewBillItemDiscount: (state, action) => {
            state.newBillItem.discount = action.payload;
        },
        addBillItem: (state, action) => {
            //if item already exists, update quantity and total
            const existingItem = state.billItems.find(item => item.id === action.payload.id);
            if (existingItem) {
                existingItem.quantity = Number(existingItem.quantity) + Number(action.payload.quantity);
                existingItem.total = existingItem.quantity * existingItem.price;
                return;
            }
            state.billItems.push(action.payload);
        },
        removeBillItem: (state, action) => {
            state.billItems = state.billItems.filter(item => item.id !== action.payload);
        },
        setGender: (state, action) => {
            state.gender = action.payload;
        },
        setModeOfPayment: (state, action) => {
            state.modeOfPayment = action.payload;
        },
        reset: (state) => {
            state.customerName = '';
            state.phoneNumber = '';
            state.employeeId = '';
            state.tip = '';
            state.discount = '';
            state.gender = '';
            state.rating = 0;
            state.newBillItem = {
                id: '',
                quantity: '',
            };
            state.billItems = [];
        }
    }
});

export default billSlice.reducer;
export const billActions = billSlice.actions;
