const bcrypt = require('bcrypt');
const db = require('../config/database');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Shop = require('../models/shop');
const Product = require('../models/product');
const ShopGroup = require('../models/shopGroup');
const Employee = require('../models/employee');
require('dotenv').config();
const saltRounds = 12;

//CRUD Controllers

exports.loginShopManager = (req, res, next) => {
    const username = req.body.username;
    const lowerCaseUsername = username.toLowerCase();
    const password = req.body.password;
    User.findOne({
        where: {
          name: lowerCaseUsername
        },
        include: [
          {
            model: Shop,
            attributes: ['id']
          },
          {
            model: ShopGroup,
            attributes: ['id']
          }
        ]
      })
        .then(async user => {
            if(!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                const tokenUser = { 
                    userId: user.id,
                    role: user.role, 
                    shopId: (user.shop)?user.shop.id:'n/a', 
                    shopGroupId: (user.shopGroup)?user.shopGroup.id:'n/a' 
                };
                console.log(tokenUser);
                const employees = await Employee.findAll({
                    where: {
                        shopGroupId: user.shopGroup.id
                    }
                })
                const products = await Product.findAll({
                    where: {
                        shopId: user.shop.id
                    }
                })
                const accessToken = jwt.sign(tokenUser, process.env.TOKEN_SECRET, { expiresIn: '10h' }); // Token expires in 10 hours
                //get all employees of this shopGroup
                

                return res.status(200).json({ accessToken: accessToken, employees: employees, products: products});
            } else {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
        })
        .catch(err => {
           console.log(err);
           return res.status(501).send('Internal server error');
        });
}


exports.loginUser = (req, res, next) => {
    console.log(req);
    const username = req.body.username;
    //strip trailing and leading whitespaces in username and password
    const trimmedUsername = username.trim();

    const lowerCaseUsername = trimmedUsername.toLowerCase();
    const password = req.body.password;
    const trimmedPassword = password.trim();
    User.findOne({
        where: {
          name: lowerCaseUsername
        },
        include: [
          {
            model: Shop,
            attributes: ['id']
          },
          {
            model: ShopGroup,
            attributes: ['id']
          }
        ]
      })
        .then(async user => {
            if(!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            const match = await bcrypt.compare(trimmedPassword, user.password);
            if (match) {
                const tokenUser = { 
                    userId: user.id,
                    role: user.role, 
                    shopId: (user.shop)?user.shop.id:'n/a', 
                    shopGroupId: (user.shopGroup)?user.shopGroup.id:'n/a' 
                };
                console.log(tokenUser);
                const accessToken = jwt.sign(tokenUser, process.env.TOKEN_SECRET, { expiresIn: '10h' }); // Token expires in 10 hours
                return res.status(200).json({ accessToken: accessToken });
            } else {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
        })
        .catch(err => {
           console.log(err);
           return res.status(501).send('Internal server error');
        });
}

//create new shop and also create a new user with role 'shop_manager' in a single transaction and shopGroupId same as the shop. username, password sent in req.body
exports.registerShopManager = async (req, res, next) => {
    const { shopName, username } = req.body;
    const password = req.body.password.trim();
    const shopGroupId = req.user.shopGroupId;
    const lowercaseName = username.trim().toLowerCase();
    if(!shopName || !username || !password) {
        return res.status(400).send('Error: Missing parameters');
    }

    //check if shopName already exists with same shopGroupId
    const existingShop = await Shop.findOne({ where: { name: shopName, shopGroupId: shopGroupId } });
    if (existingShop) {
        return res.status(409).send('Error: Shopname already in use');
    }
    
    const transaction = await db.transaction();

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create shop inside the transaction
        const shop = await Shop.create({
            name: shopName,
            shopGroupId: shopGroupId
        }, { transaction });

        // Create user inside the transaction
        const user = await User.create({
            name: lowercaseName,
            password: hashedPassword,
            role: 'SHOP_MANAGER',
            shopGroupId: shopGroupId
        }, { transaction });

        // Associate user with the shop
        await user.setShop(shop, { transaction });
        
        // Commit the transaction
        await transaction.commit();

        // Mask the password before sending the response
        user.password = '**********';

        // Send the response
        return res.status(201).json({
            message: 'Created user and shop successfully!',
            shopManager: user,
            shop: shop
        });
    } catch (err) {
        // If any part of the transaction fails, rollback the transaction
        await transaction.rollback();
        console.error(err);
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).send('Error: Shopname already in use');
        } else{
            return res.status(500).send('Internal server error');
        }        
    }
}


// //create ShopGroupManager
exports.registerShopGroupManager = async (req, res, next) => {
    const { username, shopGroupName } = req.body;
    const password = req.body.password.trim();
    const lowercaseName = username.toLowerCase();
    
    const transaction = await db.transaction();
    
    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create user inside the transaction
        const user = await User.create({
            name: lowercaseName,
            password: hashedPassword,
            role: 'SHOP_GROUP_MANAGER'
        }, { transaction });

        // Create shopGroup inside the transaction
        const shopGroup = await ShopGroup.create({
            name: shopGroupName
        }, { transaction });

        // Associate user with the shopGroup
        await user.setShopGroup(shopGroup, { transaction });

        // Commit the transaction
        await transaction.commit();

        // Mask the password before sending the response
        user.password = '**********';

        // Send the response
        return res.status(201).json({
            message: 'Created user and shopGroup successfully!',
            user: user,
            shopGroup: shopGroup
        });
    } catch (err) {
        // If any part of the transaction fails, rollback the transaction
        await transaction.rollback();
        console.error(err);
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(409).send('Error: Username already in use');
        } else{
            return res.status(500).send('Internal server error');
        }        
    }
};
