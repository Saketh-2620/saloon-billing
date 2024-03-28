import { View, StyleSheet } from 'react-native';
import { DataTable, Text, IconButton } from 'react-native-paper';
import { useSelector, useDispatch } from 'react-redux';
import { billActions } from '../store/redux/bill';

function BillItemList() {

    const dispatch = useDispatch();
    const items = useSelector(state => state.bill.billItems);
    const discount = useSelector(state => state.bill.discount);
    const tip = useSelector(state => state.bill.tip);
    const totalPrice = items.reduce((acc, item) => acc + Number(item.total), 0) - Number(discount) + Number(tip);
    return (
        <View style={styles.container}>
            <DataTable >
                <DataTable.Header >
                    <DataTable.Title>Code</DataTable.Title>
                    <DataTable.Title>Name</DataTable.Title>
                    <DataTable.Title numeric>Quantity</DataTable.Title>
                    <DataTable.Title numeric>Price</DataTable.Title>
                    <DataTable.Title numeric>Total</DataTable.Title>
                    <DataTable.Title></DataTable.Title>
                </DataTable.Header>

                {items.map((item) => (
                    <DataTable.Row key={JSON.stringify(item)}>
                        <DataTable.Cell>{item.code}</DataTable.Cell>
                        <DataTable.Cell>{item.name}</DataTable.Cell>
                        <DataTable.Cell numeric>{item.quantity}</DataTable.Cell>
                        <DataTable.Cell numeric>{item.price}</DataTable.Cell>
                        <DataTable.Cell numeric>{item.total}</DataTable.Cell>
                        <DataTable.Cell>
                            <IconButton
                                icon="delete"
                                size={14}
                                onPress={() => dispatch(billActions.removeBillItem(item.id))}
                            />
                        </DataTable.Cell>
                    </DataTable.Row>
                ))}
            </DataTable>
            <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginRight: 20, alignContent:'flex-end', padding:15}}>
                <Text>Grand Total: ₹{totalPrice.toFixed(2)}</Text>
            </View>
        </View>
    );
};

export default BillItemList;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    width: '100%',
    marginBottom: 30,
    flexDirection: "column"
  },
});