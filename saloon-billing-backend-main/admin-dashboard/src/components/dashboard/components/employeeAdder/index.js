import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';

import { userActions } from '../../../../store/user';

import { RENDER_BASE_URL } from '../../../../constants';

export default function ShopAdder() {

    const dispatch = useDispatch();
    
    const [isLoading, setIsLoading] = useState(false);
    const accessToken = useSelector((state) => state.user.accessToken);

    async function getEmployeeData() {
        try{
            const employeeResponse = await axios.get(RENDER_BASE_URL + 'shopGroup/getAllEmployees', {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            console.log('Employee Response:', employeeResponse.data.employees);
            dispatch(userActions.setEmplyeeData(employeeResponse.data.employees));
        }catch{
            console.log('Error in getting employee data');
            alert('Error in getting employee data');
        }
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const name = data.get('name');
        const phone = data.get('phone');
        
        setIsLoading(true);

        try {
            const addEmployeeResponse = await axios.post(RENDER_BASE_URL + 'shopGroup/registerEmployee', {
                name: name,
                phone: phone
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                }
            })

            console.log('Employee Added:', addEmployeeResponse.data);
            getEmployeeData();
            setIsLoading(false);
            //set all fields to empty
            document.getElementById('name').value = '';
            document.getElementById('phone').value = '';
            
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
                        Add Employee
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>    
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="name"
                        label="Employee Name"
                        name="name"
                        autoComplete="name"
                        autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="phone"
                        label="Phone Number"
                        name="phone"
                        autoComplete="phone"
                        inputProps={{
                            pattern: "[0-9]{10}",
                            title: "Number should be 10 digits long",
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
                        Add Employee
                    </Button>
                    </Box>
                    {isLoading && <CircularProgress />}
                </Box>
            </Container>
        );
}