import { StyleSheet, View  } from 'react-native';
import SearchablePicker from './SearchablePicker';
import { useSelector, useDispatch } from 'react-redux';
import { TextInput, FAB } from 'react-native-paper';
import { billActions } from '../store/redux/bill';

function BillItemAdder() {

    const billItemId = useSelector(state => state.bill.newBillItem.id);
    const quantity = useSelector(state => state.bill.newBillItem.quantity);
    const products = useSelector(state => state.shop.products);

    const dispatch = useDispatch();

    const findProductById = (id) => (products.find(item => item.id === id) || null);

    function handleAddItemPress() {
        if (!billItemId || !quantity || quantity <= 0 || !quantity.match(/^\d+$/) || !findProductById(billItemId)) {
            return;
        }
        const product = findProductById(billItemId);
        const billItem = { 
            code: product.code,
            id: billItemId, 
            name: product.name, 
            price:product.price, 
            quantity, 
            incentive: product.incentive,
            total: product.price * quantity, 
        };
        console.log(billItem);
        dispatch(billActions.addBillItem(billItem));
    }

    const setBillItemId = (newBillItemId) => {
        dispatch(billActions.setNewBillItemId(newBillItemId));
    }

    const pickerItems = products.map(product => ({ label: `${product.code} - ${product.name}`, value: product.id }));


    console.log('Picker Items:', pickerItems);

    return (
        <View style={{
            flex: 1, 
            flexDirection: 'row', 
            justifyContent: 'flex-start',
            gap: 16,
            marginRight: 100,
            alignItems: 'flex-start'
        }}>
            <SearchablePicker 
                pickerItems={pickerItems}
                placeholder='Select Item ID'
                searchPlaceholder='Search Item ID'
                value={billItemId}
                setValue={setBillItemId}
                style={styles.picker}
                containerStyle={{...styles.pickerContainer, zIndex: 998}}
            />
            <TextInput
                style={styles.input}
                value={quantity}
                placeholder='Quantity'
                onChangeText={text => dispatch(billActions.setNewBillItemQuantity(text))}
                keyboardType="numeric"
                inputMode='numeric'
            />
            <FAB icon="plus" onPress={handleAddItemPress} size="small" />
        </View>
    );
};

export default BillItemAdder;

const styles = StyleSheet.create({
    input: {
        height: 35,
        width: '35%',
        fontSize: 10,
        backgroundColor: 'white',
    },
    picker: {
        backgroundColor: 'white',
        minHeight:35,
        maxHeight:35,
        padding: 0,
        margin: 0
    },
    pickerContainer: {
        width: '70%',
        padding: 0,
        margin: 0
    }
});
