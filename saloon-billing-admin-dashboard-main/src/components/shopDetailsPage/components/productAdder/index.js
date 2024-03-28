import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';

import { RENDER_BASE_URL } from '../../../../constants';

import { userActions } from '../../../../store/user';

export default function ProductAdder({shopId}) {

    const dispatch = useDispatch();
    
    const [isLoading, setIsLoading] = useState(false);
    const accessToken = useSelector((state) => state.user.accessToken);

    async function getProductsData() {
        try {
            const getProductsResponse = await axios.get(RENDER_BASE_URL + `shopGroup/getAllProducts/${shopId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
            });
            console.log('Products Response:', getProductsResponse.data.products);
            dispatch(userActions.setProducts(getProductsResponse.data.products));

        } catch {
            console.log('Error in getting products data');
            alert('Error in getting products data');
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const name = data.get('name');
        const code = data.get('code');
        const price = data.get('price');
        const incentive = data.get('incentive');

        setIsLoading(true);

        try {
            const addProductResponse = await axios.post(RENDER_BASE_URL + 'shopGroup/createProduct', {
                name: name,
                shopId: shopId,
                code: code,
                price: price,
                incentive: incentive
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            })

            console.log('Product Added:', addProductResponse.data);
            getProductsData();
            setIsLoading(false);
            document.getElementById('name').value = '';
            document.getElementById('code').value = '';
            document.getElementById('price').value = '';
            document.getElementById('incentive').value = '';
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
                        Add Product
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>    
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Product Name"
                        name="name"
                        autoComplete="name"
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="code"
                        label="Product Code"
                        name="code"
                        autoComplete="code"
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="price"
                        label="Price"
                        name="price"
                        autoComplete="price"
                        inputProps={{
                            //should be positive number only
                            min: 0,
                            step: 0.01,
                            title: "Price should be a positive number",
                        }}
                        autoFocus
                        type='number'
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="incentive"
                        label="Incentive"
                        name="incentive"
                        autoComplete="incentive"
                        inputProps={{
                            //should be positive number only
                            min: 0,
                            step: 0.01,
                            title: "Incentive should be a positive number",
                        }}
                        autoFocus
                        type='number'
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Add Product
                    </Button>
                    </Box>
                    {isLoading && <CircularProgress />}
                </Box>
            </Container>
        );
}