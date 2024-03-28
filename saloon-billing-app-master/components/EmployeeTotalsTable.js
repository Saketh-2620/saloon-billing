import { StyleSheet, View } from 'react-native';
import { DataTable } from 'react-native-paper';


export default function EmployeeTotalsTable({rows}) {
    return (
        <View style={styles.container}>
            <DataTable >
                <DataTable.Header >
                    <DataTable.Title>Employee ID</DataTable.Title>
                    <DataTable.Title>Employee Name</DataTable.Title>
                    <DataTable.Title numeric>Total Billing</DataTable.Title>
                    <DataTable.Title numeric>Total Incentive</DataTable.Title>
                </DataTable.Header>

                {rows.map((row) => (
                    <DataTable.Row key={row.employeeId} style={styles.row}>
                        <DataTable.Cell>{row.employeeId}</DataTable.Cell>
                        <DataTable.Cell>{row.employeeName}</DataTable.Cell>
                        <DataTable.Cell numeric>{row.totalBilling}</DataTable.Cell>
                        <DataTable.Cell numeric>{row.totalIncentive}</DataTable.Cell>
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