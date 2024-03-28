import { useSelector, useDispatch } from "react-redux";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Button } from "react-native-paper";
import LoginScreen from "./screens/LoginScreen";
import BillingScreen from "./screens/BillingScreen";
import SalesScreen from "./screens/SalesScreen";
import { shopActions } from "./store/redux/shop";

export default function ScreenProvider() {
    const accessToken = useSelector((state) => state.shop.accessToken);
    const products = useSelector((state) => state.shop.products);

    const dispatch = useDispatch();

    function handleLogout() {
        dispatch(shopActions.logout());
    }

    const AuthenticatedDrawer = createDrawerNavigator();

    if(accessToken && products.length > 0){
        return (
            <AuthenticatedDrawer.Navigator
                screenOptions={
                    {
                        headerShown: true,
                        headerRight: () => (
                            <Button
                              onPress={handleLogout}
                              icon="logout"
                            >Logout</Button>
                          ),
                    }
                }  
                initialRouteName="Billing"
            >
                <AuthenticatedDrawer.Screen name="Billing" component={BillingScreen} />
                <AuthenticatedDrawer.Screen name="Sales" component={SalesScreen} />
            </AuthenticatedDrawer.Navigator>
        );
    }else{
        return (
            <LoginScreen />
        );
    }
}