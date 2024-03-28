import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { RENDER_BASE_URL } from "../../constants";
import ProductCard from "./components/productCard";
import { Accordion, Typography } from "@mui/material";
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import ProductAdder from "./components/productAdder";
import { userActions } from "../../store/user";
import { useDispatch } from "react-redux";
import BillDetails from "./components/billDetails";

export default function ShopDetailsPage() {

    const dispatch = useDispatch();

    const shopId = useParams().shopId;
    const accessToken = useSelector((state) => state.user.accessToken);
    const products = useSelector((state) => state.user.products);

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

    useEffect(() => {
        getProductsData();
    }, []);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Typography variant='h3' component='div'>
                Shop Details
            </Typography>
            <Typography variant='h5' component='div'>
                Shop ID: {shopId}
            </Typography>
            <Accordion>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
                >
                    <Typography variant="h6" gutterBottom>
                        Add Product
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <ProductAdder shopId={shopId} />
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
                >
                    <Typography variant="h6" gutterBottom>
                        Products
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                        {products.map((product) => {
                            return (
                                <ProductCard product={product} key={product.productId} />
                            );
                        })}
                    </Grid>
                </AccordionDetails>
            </Accordion>
            <Accordion>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header">
                    <Typography variant="h6" gutterBottom>
                        Bill details
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography variant='h9' component='div'>
                        <BillDetails shopId={shopId}/>
                    </Typography>
                </AccordionDetails>
            </Accordion>
        </Box>
    );
}