import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ScreenProvider from './ScreenProvider';
import store from './store/redux/store';


export default function App() {

  const AuthenticatedDrawer = createDrawerNavigator();
  const Tab = createBottomTabNavigator();

  return (
      <Provider store={store}>
          <StatusBar style="auto" />
            <NavigationContainer>
                  <ScreenProvider />
            </NavigationContainer>
      </Provider>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'white',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
