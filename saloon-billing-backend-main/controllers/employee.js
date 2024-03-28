const Shop = require('../models/shop');
const ShopGroup = require('../models/shopGroup');
const Employee = require('../models/employee');

//get employee by id 
exports.getEmployee = (req, res, next) => {
    const employeeId = req.body.id;
    Employee.findByPk(employeeId)
        .then(employee => {
            if(!employee) {
                return res.status(404).json({message: 'Employee not found'});
            }
            return res.status(200).json({employee: employee});
        })
        .catch(err => {
            console.log(err);
            return res.status(501).send('Internal server error');
        });
}   

//get all employees of user
exports.getAllEmployeesOfUser = (req, res, next) => {
    Employee.findAll({
        where: {
            shopGroupId: req.user.shopGroupId
        }
    })
        .then(employees => {
            if(!employees) {
                return res.status(404).json({message: 'Employees not found'});
            }
            return res.status(200).json({employees: employees});
        })
        .catch(err => {
            console.log(err);
            return res.status(501).send('Internal server error');
        });
}

//create employee belonging to users shopgroup
exports.createEmployee = (req, res, next) => {
    const name = req.body.name;
    const phone = req.body.phone;
    const shopGroupId = req.user.shopGroupId;
    console.log(shopGroupId);   
    Employee.create({
        name: name,
        phone: phone,
        shopGroupId: shopGroupId
    })
        .then(employee => {
            return res.status(200).json({
                //return shopgroup of employee too
                // ShopGroup: employee.getShopGroup(),
                message: 'Employee created successfully',
                employee: employee
            });
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({
                message: 'Internal server error'
            });
        });
}
