import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import { generateHTML } from './generateHTML';

export async function printBill(bill) {
    // Generate HTML content for printing
    const htmlContent = generateHTML(bill);
  
    try {
      // Print the HTML content
      const { uri } = await Print.printToFileAsync({ html: htmlContent });
      
      // Move the printed file to a permanent location
      const directory = FileSystem.documentDirectory + 'receipt.pdf';
      await FileSystem.moveAsync({ from: uri, to: directory });
  
      // Open the file for printing
      await Print.printAsync({ uri: directory });
    } catch (error) {
      console.error('Error printing receipt:', error);
      Alert.alert(
        'Printing Failed',
        'Failed to print receipt. Please try again.',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        { cancelable: false }
      );
    }
  }