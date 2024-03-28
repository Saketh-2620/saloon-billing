const billController = require('../controllers/bill');
const productController = require('../controllers/product');
const employeeController = require('../controllers/employee');
const router = require('express').Router();

router.get('/getAllBills', billController.getAllBillsOfShop);
router.get('./getBill', billController.getBillById);
router.post('/createBill', billController.createBill);
router.get('/getAllProducts', productController.getAllProductsOfShop);
router.get('/getAllEmployees', employeeController.getAllEmployeesOfUser);
router.post('/getBillByDate', billController.getAllBillsOfShopInDateRange);
module.exports = router;