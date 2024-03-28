import React from "react";
import { StyleSheet, View, TouchableOpacity, ToastAndroid } from "react-native";
import { TextInput, Text } from 'react-native-paper';
import Spinner from 'react-native-loading-spinner-overlay';
import { useDispatch, useSelector } from "react-redux";
import { shopActions } from "../store/redux/shop";
import axios from "axios";
import { LOCALHOST_BASE_URL, RENDER_BASE_URL } from "../constants";

export default function LoginScreen() {
    const username = useSelector((state) => state.shop.username);
    const password = useSelector((state) => state.shop.password);
    // const accessToken = useSelector((state) => state.shop.accessToken);
    // const products = useSelector((state) => state.shop.products);

    const [isLoginLoading, setIsLoginLoading] = React.useState(false);
    const [loginError, setLoginError] = React.useState(null);

    const dispatch = useDispatch();

    async function handleLogin() {
      console.log('Login button pressed');
      //get access token
      setLoginError(null);
      setIsLoginLoading(true);
      try {
          const loginResponse = await axios.post(RENDER_BASE_URL + 'shopLogin', {
              username: username,
              password: password
          }, {
              headers: {
                  'Content-Type': 'application/json'
              }
          });

          // Handle successful response
          // console.log('Login Response:', loginResponse.data);
          const recievedAccessToken = loginResponse.data.accessToken;
          const recievedProducts = loginResponse.data.products;
          const recievedEmployees = loginResponse.data.employees;
          console.log('Products:', recievedProducts);
          console.log('Employees:', recievedEmployees);
          console.log('Access Token:', recievedAccessToken);
          //set access token
          dispatch(shopActions.setAccessToken(recievedAccessToken)); 
          dispatch(shopActions.setProducts(recievedProducts));
          dispatch(shopActions.setEmployees(recievedEmployees));
          
          setIsLoginLoading(false);

      } catch (error) {
          setLoginError(error);
          setIsLoginLoading(false);
          console.log('Login Error:', JSON.stringify(error));
          ToastAndroid.show('An error occured!', ToastAndroid.SHORT);
      }
  }

    return (
        <View style={styles.container}>
            <View style={styles.inputView}>
                <TextInput
                  style={styles.TextInput}
                  placeholder="Username"
                  value={username}
                  placeholderTextColor="#003f5c"
                  onChangeText={text => dispatch(shopActions.setUsername(text))}
                /> 
            </View> 
            <View style={styles.inputView}>
                <TextInput
                  style={styles.TextInput}
                  placeholder="Password"
                  value={password}
                  placeholderTextColor="#003f5c"
                  secureTextEntry={true}
                  textContentType="oneTimeCode"
                  onChangeText={text => dispatch(shopActions.setPassword(text))}
                /> 
            </View> 
            <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
                <Text>Login</Text> 
            </TouchableOpacity> 
            <Spinner
              visible={isLoginLoading}
            />
        </View> 
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    marginBottom: 40,
  },
  inputView: {
    width: "70%",
    height: 45,
    marginBottom: 20,
    alignItems: "center",
  },
  TextInput: {
    height: 50,
    flex: 1,
    marginLeft: 20,
    width: 200
  },
  loginBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    width: 100,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "#FF1493",
  },
});