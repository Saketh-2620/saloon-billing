const shopGroupController = require('../controllers/shopGroup');
const shopController = require('../controllers/shop');
const userController = require('../controllers/user');
const productController = require('../controllers/product');
const employeeController = require('../controllers/employee');
const billController = require('../controllers/bill');

const router = require('express').Router();

//user management
router.get('/', shopGroupController.getShopGroup);
router.get('/getShops', shopController.getAllShopsOfUser);
router.post('/registerShopManager', userController.registerShopManager);

//product management
router.post('/createProduct', productController.createProduct);
router.delete('/deleteProduct', productController.deleteProduct);
router.get('/getAllProducts/:shopId', productController.getAllProductsOfShopAsShopGroupManager);

//employee management
router.get('/getEmployee', employeeController.getEmployee);
router.get('/getAllEmployees', employeeController.getAllEmployeesOfUser);
router.post('/registerEmployee', employeeController.createEmployee);

//bill management
router.post('/getBillByDate', billController.getAllBillsOfShopInDateRangeAsShopGroupManager);

module.exports = router;