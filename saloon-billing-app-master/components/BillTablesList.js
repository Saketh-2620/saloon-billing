import { Text } from "react-native-paper"
import { View, StyleSheet } from "react-native"
import { DataTable } from "react-native-paper"
export default function BillTablesList({sortedBills}){
    const dateOptions = {
        timeZone: 'Asia/Kolkata',
        hour12: true,
        hour: 'numeric',
        minute: 'numeric',
      };
    return (
        <View>
        {/* <Text>{(JSON.stringify(sortedBills))}</Text> */}
        {sortedBills.map((bill, index) => {
            console.log(bill)
            const date = new Date(bill.createdAt)
            const total = bill.billItems.reduce((acc, item) => acc + Number(item.quantity*item.price), 0) - Number(bill.discount) + Number(bill.tip);
            return(
                <View style={styles.container}>
                <Text style={{ marginLeft: 20, marginBottom: 10}}>Customer: {bill.customerName}</Text>
                <Text style={{marginLeft: 20, marginBottom: 10}}>Discount: {bill.discount}</Text>
                <Text style={{marginLeft: 20, marginBottom: 10}}>Tip: {bill.tip}</Text>
                <Text style={{marginLeft: 20, marginBottom: 10}}>Time: {date.toLocaleTimeString('en-IN', dateOptions)}</Text>
                <Text style={{marginLeft: 20, marginBottom: 10}}>Total: {total}</Text>
                <DataTable key={index}>
                    <DataTable.Header >
                        <DataTable.Title>Code</DataTable.Title>
                        <DataTable.Title>Name</DataTable.Title>
                        <DataTable.Title numeric>Quantity</DataTable.Title>
                        <DataTable.Title numeric>Price</DataTable.Title>
                        <DataTable.Title numeric>Total</DataTable.Title>
                    </DataTable.Header>

                    {bill.billItems.map((item) => (
                        <DataTable.Row key={JSON.stringify(item)}>
                            <DataTable.Cell>{item.product.code}</DataTable.Cell>
                            <DataTable.Cell>{item.product.name}</DataTable.Cell>
                            <DataTable.Cell numeric>{item.quantity}</DataTable.Cell>
                            <DataTable.Cell numeric>{item.price}</DataTable.Cell>
                            <DataTable.Cell numeric>{item.quantity*item.price}</DataTable.Cell>
                        </DataTable.Row>
                    ))}
                </DataTable>
                </View>
            )
        }
        )}
        </View>
    )
}

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