import { useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';

import { userActions } from "../../../../store/user";

import { RENDER_BASE_URL } from '../../../../constants';

export default function ShopAdder() {

    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = useState(false);
    const accessToken = useSelector((state) => state.user.accessToken);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const shopName = data.get('shopName');
        const username = data.get('username');
        const password = data.get('password');
        
        setIsLoading(true);

        try {
            const addShopResponse = await axios.post(RENDER_BASE_URL + 'shopGroup/registerShopManager', {
                shopName: shopName,
                username: username, 
                password: password
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            })

            async function getShopData() {
                try{
                    const shopResponse = await axios.get(RENDER_BASE_URL + 'shopGroup/getShops', {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${accessToken}`
                        }
                    });
                    console.log('Shop Response:', shopResponse.data.shops);
                    dispatch(userActions.setShopData(shopResponse.data.shops));
                }catch{
                    console.log('Error in getting shop data');
                    alert('Error in getting shop data');
                }
            }

            console.log('Shop Added:', addShopResponse.data);
            getShopData();
            setIsLoading(false);  
            //set all fields to empty
            document.getElementById('shopName').value = '';
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
            
        }
        catch (error) {
            setIsLoading(false);
            console.log('Error:', JSON.stringify(error));
            alert('Error:', JSON.stringify(error));
        }
      };
    
    return (
            <Container maxWidth="sm">
                <Box
                    sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    }}
                >
                    <Typography component="h1" variant="h5">
                        Add Shop
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>    
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="shopName"
                        label="Shop Name"
                        name="shopName"
                        autoComplete="shopName"
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username (only alphanumeric allowed)"
                        inputProps={{
                            pattern: "[a-z0-9]+",
                            title: "Only numbers and lower case alphabets allowed",
                        }}
                        name="username"
                        autoComplete="username"
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Add Shop
                    </Button>
                    </Box>
                    {isLoading && <CircularProgress />}
                </Box>
            </Container>
        );
}