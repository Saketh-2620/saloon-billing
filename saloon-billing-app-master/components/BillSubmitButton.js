import { Button } from "react-native-paper";
import { ToastAndroid, View } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { useSelector, useDispatch } from 'react-redux';
import { RENDER_BASE_URL } from "../constants"; 
import axios from "axios";
import { useState } from "react";
import { billActions } from "../store/redux/bill";
import { printBill } from "../util/printBill";

export default function BillSubmitButton() {
    const customerName = useSelector(state => state.bill.customerName);
    const phoneNumber = useSelector(state => state.bill.phoneNumber);
    const employeeId = useSelector(state => state.bill.employeeId);
    const tip = useSelector(state => state.bill.tip);
    const discount = useSelector(state => state.bill.discount);
    const gender = useSelector(state => state.bill.gender);
    const billItems = useSelector(state => state.bill.billItems);
    const rating = useSelector(state => state.bill.rating);
    const modeOfPayment = useSelector(state => state.bill.modeOfPayment);
    const accessToken = useSelector(state => state.shop.accessToken);

    const [isRequestLoading, setIsRequestLoading] = useState(false);
    const [requestError, setRequestError] = useState(null);

    const dispatch = useDispatch();

    async function handleBillSubmit() {
        if (!customerName || !phoneNumber || !employeeId || tip === null|| discount === null || billItems.length === 0) {
            ToastAndroid.show('All fields not filled!', ToastAndroid.SHORT);
            return;
        }
        const bill = {
            customerName: customerName,
            customerPhone: phoneNumber,
            employeeId: parseInt(employeeId),
            isMale: gender.toLowerCase() === 'male' ? true : false,
            tip: parseFloat(tip),
            discount: parseFloat(discount),
            billItems: billItems.map(item => ({productName: item.name ,id: parseInt(item.id), quantity: parseFloat(item.quantity), incentive: parseFloat(item.incentive), price:parseFloat(item.price)})),
            rating:rating,
            modeOfPayment: modeOfPayment
        }
        console.log(bill);

        try {
            setIsRequestLoading(true);
            const billResponse = await axios.post(RENDER_BASE_URL + 'shop/createBill', {
                ...bill
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            
            //if response status is 201
            if(billResponse.status === 201) {

                ToastAndroid.show('Bill submitted!', ToastAndroid.SHORT);
                console.log(billResponse.data);
                const recievedBill = {...bill, id: billResponse.data.id};
                await printBill(recievedBill);
                // dispatch(billActions.reset());
            }
    
            setIsRequestLoading(false);
    
        } catch (error) {
            setRequestError(error);
            setIsRequestLoading(false);
            console.log('Bill Error:', JSON.stringify(error));
            ToastAndroid.show('An error occured!', ToastAndroid.SHORT);
        }
    }
    
    return (
        <View>
            <Button mode="contained" onPress={handleBillSubmit} style={{marginTop: 20}}>Submit</Button>
            <Spinner
              visible={isRequestLoading}
            />
        </View>
    );
}