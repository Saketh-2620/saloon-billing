const Bill = require('../models/bill');
const BillItem = require('../models/billItem');
const Product = require('../models/product');
const Employee = require('../models/employee');
const Shop = require('../models/shop');
const { Op } = require('sequelize');


function getStartOfDayInIST(dateString) {
    // const [year, month, day] = dateString.split('-').map(Number);
    const start = new Date(`${dateString}T00:00:00Z`);
    start.setUTCHours(0, 0, 0); // Set time to midnight UTC
    return new Date(start.getTime() - (5.5 * 60 * 60 * 1000)); // Adjust to IST (UTC+5:30)
}

function getEndOfDayInIST(dateString) {
    const end = new Date(`${dateString}T23:59:59Z`);
    return new Date(end.getTime() - (5.5 * 60 * 60 * 1000)); // Adjust to IST (UTC+5:30)
}

//get bill by id
exports.getBillById = (req, res, next) => {
    const billId = req.body.billId;
    // fetch bill by id along with its shop, then fetch the shopGroupId of the shop
    Bill.findByPk(billId, { include: [{ all: true }] })
        .then(bill => {
            // if the shopGroupId of the shop is the same as the shopGroupId of the user, then return the bill
            if (bill.shop.shopGroup.id == req.body.shopGroupId) {
                //get all billItems with the billId and return them along with the bill
                BillItem.findAll({ where: { billId: billId } })
                    .then(billItems => {
                        return res.status(200).json({
                            bill: bill,
                            billItems: billItems
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        return res.status(500).json({
                            message: 'Internal server error'
                        });
                    });
            } else {
                return res.status(401).json({
                    message: 'Unauthorized'
                });
            }
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({
                message: 'Internal server error'
            });
        });
    }


//get all bills of a shop. ShopId is passed in the body
exports.getAllBillsOfShop = (req, res, next) => {
    const shopId = req.user.shopId;
    // fetch all bills of a shop along with its shop, then fetch the shopGroupId of the shop
    Bill.findAll({ where: { shopId: shopId }, include: [{ all: true }] })
        .then(bills => {
            //for each bill in bills, create a new object with bill and billItems and push it to an array, and return the array to user
            let billsArray = [];
            bills.forEach(bill => {
                //get all billItems with the billId and return them along with the bill
                BillItem.findAll({ where: { billId: bill.id } })
                    .then(billItems => {
                        billsArray.push({
                            bill: bill,
                            billItems: billItems
                        });
                        
                    })
                    .catch(err => {
                        console.log(err);
                        return res.status(500).json({
                            message: 'Internal server error'
                        });
                    });
            });

            return res.status(200).json({
                bills: billsArray
            });
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({
                message: 'Internal server error'
            });
        });
    }

exports.getAllBillsOfShopInDateRange = async (req, res, next) => {
    const shopId = req.user.shopId;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    // format of date is yyyy-mm-dd
    //convert date from ist to utc
    const startTimeUtc = getStartOfDayInIST(startDate);
    const endTimeUtc = getEndOfDayInIST(endDate);

    console.log(startTimeUtc);
    console.log(endTimeUtc);

    BillItem.findAll({
            where: {
                createdAt: {
                    [Op.between]: [startTimeUtc, endTimeUtc]
                }
            },
            include: [
                {
                    model: Bill,
                    where: { shopId: shopId },
                    include: [
                        { model: Employee },
                        { model: Shop }
                    ]
                },
                { model: Product }
            ]
        })
        .then(billItems => {
            console.log(billItems);
            return res.status(200).json({
                billItems: billItems
            });
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({
                message: 'Internal server error'
            });
        });
}
//get all bills of a shop in a given date range. ShopId, startDate and endDate are passed in the body. Return json of employeeId, employeeName, totalBills, totalAmount, totalDiscount, totalTip, totalIncentive.
exports.getAllBillsOfShopInDateRangeAsShopGroupManager = async (req, res, next) => {
    const shopId = req.body.shopId;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    
    // format of date is yyyy-mm-dd
    //convert date from ist to utc
    const startTimeUtc = getStartOfDayInIST(startDate);
    const endTimeUtc = getEndOfDayInIST(endDate);

    console.log(startTimeUtc);
    console.log(endTimeUtc);

    BillItem.findAll({
            where: {
                createdAt: {
                    [Op.between]: [startTimeUtc, endTimeUtc]
                }
            },
            include: [
                {
                    model: Bill,
                    where: { shopId: shopId },
                    include: [
                        { model: Employee },
                        { model: Shop }
                    ]
                },
                { model: Product }
            ]
        })
        .then(billItems => {
            console.log(billItems);
            return res.status(200).json({
                billItems: billItems
            });
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({
                message: 'Internal server error'
            });
        });
}
//Create a bill. CustomerId and employeeId are passed in the body. ShopId is in req.user.shopId
exports.createBill = (req, res, next) => {
    const shopId = req.user.shopId;
    const customerPhone = req.body.customerPhone;
    const customerName = req.body.customerName;
    const discount = req.body.discount;
    const rating = req.body.rating;
    const isMale = req.body.isMale;
    const employeeId = req.body.employeeId;
    const modeOfPayment = req.body.modeOfPayment? req.body.modeOfPayment : 'cash';
    const tip = req.body.tip;
    const billItems = req.body.billItems;   
    Bill.create({
        shopId: shopId,
        customerName: customerName,
        customerPhone: customerPhone,
        isMale: isMale,
        employeeId: employeeId,
        discount: discount,
        rating: rating,
        tip: tip,
        modeOfPayment: modeOfPayment
    })
    //create bill items and link it to this bill id
    .then(bill => {
        billItems.forEach(billItem => {
            //find product whose code is billItem.productCode and shopId is shopId. If it does not exist, then return error
            Product.findOne({ where: { id: billItem.id, shopId: shopId } })
                .then(product => {
                    if (!product || product.length === 0) {
                        return res.status(400).json({
                            message: 'Product not found'
                        });
                    }

                    BillItem.create({
                        billId: bill.id,
                        productId: billItem.id,
                        quantity: billItem.quantity,
                        price: billItem.price,
                        incentive: billItem.incentive
                    })
                    .catch(err => {
                        console.log(err);
                        return res.status(500).json({
                            message: 'Internal server error'
                        });
                    });

                })
                .catch(err => {
                    console.log(err);
                    return res.status(500).json({
                        message: 'Internal server error'
                    });
                });
        });
        return bill;
    })
    .then(bill => {
        return res.status(201).json({
            message: 'Bill created',
            id: bill.id
        });
    })
}

