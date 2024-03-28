import { StyleSheet, View } from 'react-native';
import { DataTable } from 'react-native-paper';


export default function ProductCountsTable({rows}) {
    return (
        <View style={styles.container}>
            <DataTable >
                <DataTable.Header >
                    {/* <DataTable.Title>Employee ID</DataTable.Title> */}
                    <DataTable.Title>Code</DataTable.Title>
                    <DataTable.Title numeric>Name</DataTable.Title>
                    <DataTable.Title numeric>Count</DataTable.Title>
                </DataTable.Header>

                {rows.map((row) => (
                    <DataTable.Row key={row.productId} style={styles.row}>
                        {/* <DataTable.Cell>{row.productId}</DataTable.Cell> */}
                        <DataTable.Cell>{row.code}</DataTable.Cell>
                        <DataTable.Cell numeric>{row.productName}</DataTable.Cell>
                        <DataTable.Cell numeric>{row.count}</DataTable.Cell>
                    </DataTable.Row>
                ))}
            </DataTable>
        </View>
    );
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