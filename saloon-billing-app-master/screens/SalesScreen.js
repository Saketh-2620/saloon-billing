import { ScrollView, ToastAndroid, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { useSelector } from "react-redux";
import axios from "axios";
import { useEffect, useState } from "react";
import { RENDER_BASE_URL } from "../constants";
import EmployeeTotalsTable from "../components/EmployeeTotalsTable";
import Spinner from 'react-native-loading-spinner-overlay';
import ProductCountsTable from "../components/ProductCountsTable";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { StyleSheet } from "react-native";
import BillTablesList from "../components/BillTablesList";

function calculateEmployeeTotals(billItems) {
    const employeeTotalsMap = new Map();
  
    billItems.forEach(item => {
        const { price } = item;
        const employee = item.bill.employee;
        const incentive = item.incentive;
  
        if (employee && incentive && price) {
            const employeeName = employee.name;
            const employeeId = employee.id;
  
            if (!employeeTotalsMap.has(employeeId)) {
                employeeTotalsMap.set(employeeId, {
                    employeeId,
                    employeeName,
                    totalBilling: 0,
                    totalIncentive: 0
                });
            }
  
            const employeeTotal = employeeTotalsMap.get(employeeId);
            employeeTotal.totalBilling += price;
            employeeTotal.totalIncentive += incentive;
        }
    })
    return Array.from(employeeTotalsMap.values());
  };

function calculateProductCounts(billItems) {
const productCounts = [];

billItems.forEach(item => {
    const {productId, product, quantity } = item;
    
    if (product) {
        const { name: productName, code: productCode } = product;
        
        const existingProduct = productCounts.find(prod => prod.productId === productId);
        
        if (existingProduct) {
            existingProduct.count += quantity;
        } else {
            productCounts.push({
                productId,
                productName,
                count: quantity,
                code: productCode
            });
        }
    }
});

return productCounts;
}


function sortBillsFromBillItems(billItems) {
    const sortedBills = [];
    billItems.forEach(billItem => {
        const { bill } = billItem;
        const existingBill = sortedBills.find(b => b.id === bill.id);
        if (existingBill) {
            existingBill.billItems.push(billItem);
        } else {
            sortedBills.push({
                ...bill, billItems: [billItem]
            });
        }
    });
    return sortedBills;
}


const picked = false;

export default function SalesScreen() {

    const [billData, setBillData] = useState([]);

    const [date, setDate] = useState(new Date());

    const [isLoading, setIsLoading] = useState(false);

    const [showDatePicker, setShowDatePicker] = useState(false);
    
    const accessToken = useSelector(state => state.shop.accessToken);

    const handleSubmit = async (event) => {
        const startDate = formatDateForDB(date).toString();
        const endDate = formatDateForDB(date).toString();
        console.log('Date:', startDate, endDate);
        setIsLoading(true);
        try {
        const response = await axios.post(RENDER_BASE_URL + 'shop/getBillByDate', { 
            startDate: startDate,
            endDate: endDate
        }, {
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
            }
        });
        console.log(response.data.billItems);
        setBillData(response.data.billItems);
        setIsLoading(false);
        } catch (error) {
        console.error('Error:', error);
        setIsLoading(false);
        ToastAndroid.show('An error occured!', ToastAndroid.SHORT);
        }
        console.log('Date:', startDate, endDate);
    };

    function formatDate(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Adding 1 to get the correct month
        const year = date.getFullYear();
      
        return `${day}-${month}-${year}`;
      }
    
      //date object to yyyy-mm-dd
    function formatDateForDB(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Adding 1 to get the correct month
        const year = date.getFullYear();
    
        return `${year}-${month}-${day}`;
    }

    const employeeTotals = calculateEmployeeTotals(billData);
    const productCounts = calculateProductCounts(billData);
    const sortedBills = sortBillsFromBillItems(billData);

    return (
        <ScrollView>
        <View style={{marginTop:"5%"}}>
            <Spinner
              visible={isLoading}
            />
            <View style={{
                    // flex: 1, 
                    flexDirection: 'column', 
                    justifyContent: 'flex-start',
                    gap: 16,
                    marginRight: "3%"
                }}
            >
                <Button mode="contained" onPress={() => setShowDatePicker(true)} style={{width:"40%"}} icon="calendar">
                    {date? formatDate(date) : 'Select Date'}
                </Button>
                <Button onPress={handleSubmit} mode="contained" style={styles.getSalesDataButton}>Get Sales Data</Button>
                {billData.length > 0 && <EmployeeTotalsTable rows={employeeTotals} />}
                {billData.length > 0 && <ProductCountsTable rows={productCounts} />}
                {billData.length > 0 && <BillTablesList sortedBills={sortedBills} />}
                {billData.length === 0 && <Text variant="headlineMedium">No bills available</Text>}
                {showDatePicker && (
                    <RNDateTimePicker
                        testID='dateTimePicker'
                        value={date}
                        mode={'date'} 
                        display='default'
                        onChange={(event, selectedDate) => {
                            setShowDatePicker((prev) => !prev);
                            setDate(selectedDate);
                            picked = true;
                            }
                        }
                />)}
            </View>
        </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    datePicker: {
        width: "80%",
        borderRadius: 25,
        height: 50,
        width: 100,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        color: 'white',
        backgroundColor: "#FF1493",
      },
    getSalesDataButton: {
        width: "50%",
        borderRadius: 25,
        height: 50,
        // width: 100,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        backgroundColor: "#FF1493",
    },
    dateText: {
        color: 'white'
    }
});



const example = {
    "billItems": [
        {
            "id": 2,
            "price": 70,
            "quantity": 1,
            "incentive": 20,
            "createdAt": "2024-02-19T19:22:47.477Z",
            "updatedAt": "2024-02-19T19:22:47.477Z",
            "billId": 2,
            "productId": 1,
            "bill": {
                "id": 2,
                "discount": 0,
                "rating": 4,
                "tip": 0,
                "customerName": "Rahul",
                "isMale": true,
                "customerPhone": "9999999999",
                "createdAt": "2024-02-19T19:22:46.592Z",
                "updatedAt": "2024-02-19T19:22:46.592Z",
                "employeeId": 1,
                "shopId": 1,
                "employee": {
                    "id": 1,
                    "name": "testemp11",
                    "phone": "9876543210",
                    "createdAt": "2024-02-07T17:09:54.413Z",
                    "updatedAt": "2024-02-07T17:09:54.413Z",
                    "shopGroupId": 1
                },
                "shop": {
                    "id": 1,
                    "name": "testshop11",
                    "createdAt": "2024-02-07T17:06:25.823Z",
                    "updatedAt": "2024-02-07T17:06:25.823Z",
                    "shopGroupId": 1
                }
            },
            "product": {
                "id": 1,
                "name": "Haircut",
                "price": 70,
                "incentive": 5,
                "code": "HC1",
                "createdAt": "2024-02-07T17:08:41.460Z",
                "updatedAt": "2024-02-07T17:08:41.460Z",
                "shopId": 1
            }
        },
        {
            "id": 3,
            "price": 70,
            "quantity": 1,
            "incentive": 5,
            "createdAt": "2024-02-19T19:30:42.227Z",
            "updatedAt": "2024-02-19T19:30:42.227Z",
            "billId": 3,
            "productId": 3,
            "bill": {
                "id": 2,
                "discount": 0,
                "rating": 4,
                "tip": 0,
                "customerName": "Rahul",
                "isMale": true,
                "customerPhone": "9999999999",
                "createdAt": "2024-02-19T19:22:46.592Z",
                "updatedAt": "2024-02-19T19:22:46.592Z",
                "employeeId": 1,
                "shopId": 1,
                "employee": {
                    "id": 1,
                    "name": "testemp11",
                    "phone": "9876543210",
                    "createdAt": "2024-02-07T17:09:54.413Z",
                    "updatedAt": "2024-02-07T17:09:54.413Z",
                    "shopGroupId": 1
                },
                "shop": {
                    "id": 1,
                    "name": "testshop11",
                    "createdAt": "2024-02-07T17:06:25.823Z",
                    "updatedAt": "2024-02-07T17:06:25.823Z",
                    "shopGroupId": 1
                }
            },
            "product": {
                "id": 3,
                "name": "Facial",
                "price": 70,
                "incentive": 5,
                "code": "FC1",
                "createdAt": "2024-02-07T17:09:04.275Z",
                "updatedAt": "2024-02-07T17:09:04.275Z",
                "shopId": 1
            }
        },
        {
            "id": 4,
            "price": 70,
            "quantity": 1,
            "incentive": 5,
            "createdAt": "2024-02-19T20:17:33.583Z",
            "updatedAt": "2024-02-19T20:17:33.583Z",
            "billId": 4,
            "productId": 3,
            "bill": {
                "id": 4,
                "discount": 0,
                "rating": 4,
                "tip": 0,
                "customerName": "Rahul",
                "isMale": true,
                "customerPhone": "0909090909",
                "createdAt": "2024-02-19T20:17:33.558Z",
                "updatedAt": "2024-02-19T20:17:33.558Z",
                "employeeId": 1,
                "shopId": 1,
                "employee": {
                    "id": 1,
                    "name": "testemp11",
                    "phone": "9876543210",
                    "createdAt": "2024-02-07T17:09:54.413Z",
                    "updatedAt": "2024-02-07T17:09:54.413Z",
                    "shopGroupId": 1
                },
                "shop": {
                    "id": 1,
                    "name": "testshop11",
                    "createdAt": "2024-02-07T17:06:25.823Z",
                    "updatedAt": "2024-02-07T17:06:25.823Z",
                    "shopGroupId": 1
                }
            },
            "product": {
                "id": 3,
                "name": "Facial",
                "price": 70,
                "incentive": 5,
                "code": "FC1",
                "createdAt": "2024-02-07T17:09:04.275Z",
                "updatedAt": "2024-02-07T17:09:04.275Z",
                "shopId": 1
            }
        },
        {
            "id": 5,
            "price": 70,
            "quantity": 5,
            "incentive": 5,
            "createdAt": "2024-02-19T20:18:33.961Z",
            "updatedAt": "2024-02-19T20:18:33.961Z",
            "billId": 5,
            "productId": 2,
            "bill": {
                "id": 4,
                "discount": 0,
                "rating": 4,
                "tip": 0,
                "customerName": "Rahul",
                "isMale": true,
                "customerPhone": "0909090909",
                "createdAt": "2024-02-19T20:17:33.558Z",
                "updatedAt": "2024-02-19T20:17:33.558Z",
                "employeeId": 1,
                "shopId": 1,
                "employee": {
                    "id": 1,
                    "name": "testemp11",
                    "phone": "9876543210",
                    "createdAt": "2024-02-07T17:09:54.413Z",
                    "updatedAt": "2024-02-07T17:09:54.413Z",
                    "shopGroupId": 1
                },
                "shop": {
                    "id": 1,
                    "name": "testshop11",
                    "createdAt": "2024-02-07T17:06:25.823Z",
                    "updatedAt": "2024-02-07T17:06:25.823Z",
                    "shopGroupId": 1
                }
            },
            "product": {
                "id": 2,
                "name": "Shaving",
                "price": 70,
                "incentive": 5,
                "code": "SV1",
                "createdAt": "2024-02-07T17:08:53.652Z",
                "updatedAt": "2024-02-07T17:08:53.652Z",
                "shopId": 1
            }
        }
    ]
}