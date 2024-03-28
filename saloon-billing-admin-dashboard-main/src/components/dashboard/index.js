import axios from "axios";
import { useEffect } from "react";
import { RENDER_BASE_URL } from "../../constants";
import { useSelector, useDispatch } from "react-redux";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';

import { userActions } from "../../store/user";

import ShopCard from "./components/shopCard";
import EmployeeCard from "./components/employeeCard";
import EmployeeAdder from "./components/employeeAdder";
import ShopAdder from "./components/shopAdder";

export default function Dashboard() {

    const accessToken = useSelector((state) => state.user.accessToken);
    const dispatch = useDispatch();
    const shopData = useSelector((state) => state.user.shopData);
    const employeeData = useSelector((state) => state.user.employeeData);

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

    useEffect(() => {
        getShopData();
        getEmployeeData();
    }, []);


    return (
        <div>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                    {/* <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton> */}
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Dashboard
                    </Typography>
                    <Button color="inherit" onClick={() => dispatch(userActions.logout())}>Logout</Button>
                    </Toolbar>
                </AppBar>
                <Accordion>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                    >
                        <Typography variant="h6" gutterBottom>
                            Add Shop and Employee
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <ShopAdder/>
                            </Grid>
                            <Grid item xs={6}>
                                <EmployeeAdder/>
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1-content"
                    id="panel1-header"
                    >
                        <Typography variant="h6" gutterBottom>
                            Shops
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                            {shopData.map((shop, index) => (
                            <Grid item xs={2} sm={4} md={4} key={index}>
                                <ShopCard shopId={shop.id} shopName={shop.name}/>
                            </Grid>
                            ))}
                        </Grid>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel2-content"
                    id="panel2-header"
                    >
                        <Typography variant="h6" gutterBottom>
                            Employees
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                            {employeeData.map((employee, index) => (
                            <Grid item xs={2} sm={4} md={4} key={index}>
                                <EmployeeCard id={employee.id} name={employee.name} phoneNumber={employee.phone}/>
                            </Grid>
                            ))}
                        </Grid>
                    </AccordionDetails>
                </Accordion>
            </Box>
        </div>
    );
}