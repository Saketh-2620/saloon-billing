import { useSelector, useDispatch } from 'react-redux';
import { StyleSheet, View } from 'react-native';
import { TextInput, Text } from 'react-native-paper';
import StarRating from 'react-native-star-rating';
import SearchablePicker from './SearchablePicker';
import { billActions } from '../store/redux/bill';
import { Picker } from '@react-native-picker/picker';

function BillDetails () {

    const dispatch = useDispatch();

    const name = useSelector(state => state.bill.customerName);
    const phoneNumber = useSelector(state => state.bill.phoneNumber);
    const employeeId = useSelector(state => state.bill.employeeId);
    const gender = useSelector(state => state.bill.gender);
    const tip = useSelector(state => state.bill.tip);
    const discount = useSelector(state => state.bill.discount);
    const rating = useSelector(state => state.bill.rating);
    const employees = useSelector(state => state.shop.employees);
    const modeOfPayment = useSelector(state => state.bill.modeOfPayment);

    const findEmployeeById = (id) => (employees.find(item => item.id === parseInt(id)) || null);

    console.log(findEmployeeById(employeeId));

    return (
        <View style={{
            flex: 1, 
            flexDirection: 'column', 
            justifyContent: 'flex-start',
            gap: 16,
            marginRight: 100
        }}> 
                <View style={{
                    flexDirection: 'row',
                    gap: 9,
                    alignItems: 'center',
                    justifyContent: 'flex-start'
                }}>

                    <Text variant="labelLarge">Customer Name:</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Customer Name"
                        value={name}
                        onChangeText={(newName) => dispatch(billActions.setCustomerName(newName))}
                        inputMode='text'
                    />
                </View>
                <View style={{
                    flexDirection: 'row',
                    gap: 16,
                    alignItems: 'center',
                    justifyContent: 'flex-start'
                }}>
                    <Text variant="labelLarge">Phone Number:</Text>
                    <TextInput 
                        style={styles.input}
                        placeholder="Phone No"
                        value={phoneNumber}
                        onChangeText={newPhoneNumber => dispatch(billActions.setPhoneNumber(newPhoneNumber))}
                        keyboardType="phone-pad"
                        inputMode='numeric'
                    />
                </View>
                <View style={{
                    flexDirection: 'row',
                    gap: 16,
                    alignItems: 'center',
                    justifyContent: 'flex-start'
                }}>
                    <Text variant="labelLarge">Employee ID:    </Text>  
                    <TextInput 
                        style={styles.input}
                        placeholder="Employee ID"
                        value={employeeId}
                        onChangeText={newEmployeeId => dispatch(billActions.setEmployeeId(newEmployeeId))}
                        keyboardType="phone-pad"
                        inputMode='numeric'
                    />
                </View>
                <View style={{
                    flexDirection: 'row',
                    gap: 16,
                    alignItems: 'center',
                    justifyContent: 'flex-start'
                }}>
                    <Text variant="labelLarge">Selected Employee: </Text>
                    <Text variant="labelLarge">{findEmployeeById(employeeId)?.name || 'None'}</Text>
                </View>
                <View style={{
                    flexDirection: 'row',
                    gap: 16,
                    alignItems: 'center',
                    justifyContent: 'flex-start'
                }}>                    
                    <Text variant="labelLarge">Tip:                     </Text>
                    <TextInput 
                        style={styles.input}
                        placeholder="Tip"
                        value={tip}
                        onChangeText={newTip => dispatch(billActions.setTip(newTip))}
                        keyboardType="phone-pad"
                        inputMode='numeric'
                    />
                </View>
                <View style={{
                    flexDirection: 'row',
                    gap: 16,
                    alignItems: 'center',
                    justifyContent: 'flex-start'
                }}>
                    <Text variant="labelLarge">Discount:           </Text>
                    <TextInput 
                        style={styles.input}
                        placeholder="Discount"
                        value={discount}
                        onChangeText={newDiscount => dispatch(billActions.setDiscount(newDiscount))}
                        keyboardType="phone-pad"
                        inputMode='numeric'
                    />
                </View>
                <View style={{
                    flexDirection: 'row',
                    gap: 16,
                    alignContent: 'center',
                    justifyContent: 'flex-start'
                }}>
                    <Text variant="labelLarge">Gender:                    </Text>
                    <Picker
                        selectedValue={gender}
                        style={styles.pickerNoSearch}
                        onValueChange={(itemValue, itemIndex) =>
                            dispatch(billActions.setGender(itemValue))
                        }>
                        <Picker.Item label="Male" value="male" />
                        <Picker.Item label="Female" value="female" />
                    </Picker> 
                </View>
                <View style={{
                    flexDirection: 'row',
                    gap: 16,
                    alignItems: 'center',
                    justifyContent: 'flex-start'
                }}>
                    <Text variant="labelLarge">Mode of payment: </Text>
                    <Picker
                        selectedValue={modeOfPayment}
                        style={styles.pickerNoSearch}
                        onValueChange={(itemValue, itemIndex) =>
                            dispatch(billActions.setModeOfPayment(itemValue))
                        }>
                        <Picker.Item label="Cash" value="cash" />
                        <Picker.Item label="Card" value="card" />
                        <Picker.Item label="UPI" value="upi" />
                    </Picker>
                </View>

                <StarRating
                    disabled={false}
                    maxStars={5}
                    rating={rating}
                    halfStarEnabled={true}
                    selectedStar={(rating) => dispatch(billActions.setRating(rating))}
                />
            </View>
    )
};

export default BillDetails;

const styles = StyleSheet.create({
    input: {
        height: 35,
        width: '70%',
        backgroundColor: 'white',
    },
    picker: {
        backgroundColor: 'white',
        minHeight:35,
        maxHeight:35,
        padding: 0,
        margin: 0,
    },
    pickerContainer: {
        width: '70%',
        padding: 0,
        margin: 0,
    },
    pickerNoSearch: {
        height: 30,
        width: "60%",
        backgroundColor: '#e0e0e0',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#888',
        padding: 0,
      },
});