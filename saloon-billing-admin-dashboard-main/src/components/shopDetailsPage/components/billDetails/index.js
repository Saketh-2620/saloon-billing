import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Grid } from '@mui/material';
import Button from '@mui/material/Button';
import { RENDER_BASE_URL } from '../../../../constants';
import EmployeeTotalsTable from './components/employeeTotalsTable';
import ProductCountsTable from './components/productCountsTable';


function calculateEmployeeTotals(billItems) {
  const employeeTotalsMap = new Map();

  billItems.forEach(item => {
      const { price } = item;
      const employee = item.bill.employee;
      const incentive = item.incentive;

      if (employee && incentive && price) {
          const employeeName = employee.name;
          const employeeId = employee.id;

          if (!employeeTotalsMap.has(employeeId)) {
              employeeTotalsMap.set(employeeId, {
                  employeeId,
                  employeeName,
                  totalBilling: 0,
                  totalIncentive: 0
              });
          }

          const employeeTotal = employeeTotalsMap.get(employeeId);
          employeeTotal.totalBilling += price;
          employeeTotal.totalIncentive += incentive;
      }
  })
  console.log('employeeTotalsMap:', employeeTotalsMap);
  return Array.from(employeeTotalsMap.values());
};

function calculateProductCounts(billItems) {
  const productCounts = [];
  
  billItems.forEach(item => {
      const {productId, product, quantity } = item;
      
      if (product) {
          const { name: productName, code: productCode } = product;
          
          const existingProduct = productCounts.find(prod => prod.productId === productId);
          
          if (existingProduct) {
              existingProduct.count += quantity;
          } else {
              productCounts.push({
                  productId,
                  productName,
                  count: quantity,
                  code: productCode
              });
          }
      }
  });
  
  return productCounts;
}

export default function BillDetails ({shopId}) {
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [billData, setBillData] = useState([]);

  const accessToken = useSelector((state) => state.user.accessToken);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post(RENDER_BASE_URL + 'shopGroup/getBillByDate', { 
        shopId: shopId, 
        startDate: startDate.toString(), 
        endDate: endDate.toString()
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      });
      console.log(response.data);
      setBillData(response.data.billItems);
    } catch (error) {
      console.error('Error:', error);
    }
    console.log('Date:', startDate, endDate);
  };

  const employeeTotals = calculateEmployeeTotals(billData);
  const productCounts = calculateProductCounts(billData);

  console.log('employeeTotals:', employeeTotals);
  console.log('productCounts:', productCounts);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2} rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} alignContent={'center'}>
          <Grid item xs={2} sm={2} md={2}>
            <label>
              Start Date:
              <input type="date" value={startDate} onChange={(e) => {setStartDate(e.target.value)}} required/>
            </label>
          </Grid>
          <Grid item xs={2} sm={2} md={2}>
            <label>
              End Date:
              <input type="date" value={endDate} onChange={(e) => {setEndDate(e.target.value)}} required/>
            </label>
          </Grid>
          <Grid item xs={2} sm={2} md={2}>
            <Button
                type="submit"
                variant="contained"
                size='small'
            >
                Get Bills
            </Button>
          </Grid>
        </Grid>
      </form>
      <br /><br /><br />
      <EmployeeTotalsTable rows={employeeTotals} />
      <br /><br /><br />
      <ProductCountsTable rows={productCounts} />
    </div>
  );
};