import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
import { Divider } from 'react-native-paper';
import BillDetails from '../components/BillDetails';
import BillItemAdder from '../components/BillItemAdder';
import BillItemList from '../components/BillItemList';
import BillSubmitButton from '../components/BillSubmitButton';


function BillingScreen() {

    return (
        <SafeAreaView>
        <ScrollView>
            <View style={styles.parent}>
                <BillDetails />
                <Divider />
                <BillItemAdder /> 
                <Divider />
                <BillItemList />
                <BillSubmitButton />
            </View>
        </ScrollView>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    //container styles, all elements in single row
    parent: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        margin: 25,
        gap: 10
    }
});
export default BillingScreen;
