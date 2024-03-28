const Product = require('../models/product');
const Shop = require('../models/shop');
const ShopGroup = require('../models/shopGroup');

//create product
exports.createProduct = (req, res, next) => {
    const shopId = req.body.shopId;
    const name = req.body.name;
    const price = req.body.price;
    const incentive = req.body.incentive;
    const code = req.body.code;
    const shopGroupId = req.user.shopGroupId;

    Shop.findByPk(shopId, { include: { all: true } })
        .then(shop => {
            // If shop is not found, send a response and end the function
            if(!shop){
                return res.status(404).json({
                    message: 'Shop not found'
                });
            }
            else if(shop.shopGroup.id != shopGroupId){
                throw new Error('Unauthorized');
            }
            // Create the product and return the product creation promise
            else{
                    //check if product with same name and shopId already exists
                    return Product.findOne({ where: { name: name, shopId: shopId } })
                        .then(existingProduct => {
                            if (existingProduct) {
                                return res.status(409).json({
                                    message: 'Error: Product already exists'
                                });
                            } else {
                                //check if product with same code and shopId already exists
                                return Product.findOne({ where: { code: code, shopId: shopId } })
                                    .then(existingProduct => {
                                        if (existingProduct) {
                                            return res.status(409).json({
                                                message: 'Error: Product already exists'
                                            });
                                        } else {
                                            return Product.create({
                                                name: name,
                                                price: price,
                                                incentive: incentive,
                                                code: code,
                                                shopId: shopId
                                            });
                                        }
                                    })
                                    .catch(err => {
                                        // Handle errors and send appropriate response
                                        // console.log(err);
                                        if (err.message === 'Product already exists') {
                                            return res.status(409).json({
                                                message: 'Error: Product already exists'
                                            });
                                        } else {
                                            return res.status(500).json({
                                                message: 'Internal server error'
                                            });
                                        }
                                    });
                            }
                        });
            }
        })
        .then(product => {
            // Send the success response
            return res.status(200).json({
                message: 'Product created successfully',
                product: product
            });
        })
        .catch(err => {
            // Handle errors and send appropriate response
            // console.log(err);
            if (err.message === 'Unauthorized') {
                return res.status(401).json({
                    message: 'Unauthorized'
                });
            } else if (err.name === 'SequelizeUniqueConstraintError' || err.message === 'Product already exists') {
                return res.status(409).json({
                    message: 'Error: Product name or code already in use'
                });
            } else {
                return res.status(500).json({
                    message: 'Internal server error'
                });
            }
        });
}

//get all products for a shop, get shop id from request body
exports.getAllProductsOfShop = (req, res, next) => {
    const shopId = req.user.shopId
    console.log(req.user);
    //find all products of the shop
    Product.findAll({ where: { shopId: shopId } })
        .then(products => {
            return res.status(200).json({
                products: products
            });
        })
        .catch(err => {
            console.log(err);
            return res.status(500).json({
                message: 'Internal server error'
            });
        });
}

exports.getAllProductsOfShopAsShopGroupManager = (req, res, next) => {
    const shopId = req.params.shopId;
    const shopGroupId = req.user.shopGroupId;
    console.log("banana");
    console.log(req.body.shopId);
    console.log(req.user.shopGroupId);
    //find all products of the shop
    //check if shop belongs to shopgroup of user
    Shop.findByPk(shopId, { include: { all: true } })
        .then(shop => {
            if (shop.shopGroup.id == shopGroupId) {
                return Product.findAll({ where: { shopId: shopId } })
                    .then(products => {
                        return res.status(200).json({
                            products: products
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
    // Product.findAll({ where: { shopId: shopId } })
    //     .then(products => {
    //         return res.status(200).json({
    //             products: products
    //         });
    //     })
    //     .catch(err => {
    //         console.log(err);
    //         return res.status(500).json({
    //             message: 'Internal server error'
    //         });
    //     });
}

//edit product by ID if product belongs to shopgroup of user, get shopGroupId from request body, get shop from existing product
exports.editProduct = (req, res, next) => {
    const productId = req.body.productId;
    const shopGroupId = req.body.shopGroupId;
    const name = req.body.name;
    const price = req.body.price;
    const incentive = req.body.incentive;
    const code = req.body.code;
    //fetch product by id along with its shop, then fetch the shopGroupId of the shop
    Product.findByPk(productId, { include: { all: true } })
        .then(product => {
            //if the shopGroupId of the shop is the same as the shopGroupId of the user, then edit the product
            if (product.shop.shopGroup.id == shopGroupId) {
                product.name = name;
                product.price = price;
                product.incentive = incentive;
                product.code = code;
                product.save()
                    .then(() => {
                        return res.status(200).json({
                            message: 'Product edited successfully'
                        });
                    })
                    .catch(err => {
                        // console.log(err);
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
            // console.log(err);
            return res.status(500).json({
                message: 'Internal server error'
            });
        });
}

//delete product by ID if product belongs to shopgroup of user
exports.deleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    const shopGroupId = req.body.shopGroupId;
    //fetch product by id along with its shop, then fetch the shopGroupId of the shop
    Product.findByPk(productId, { include: { all: true } })
        .then(product => {
            //if the shopGroupId of the shop is the same as the shopGroupId of the user, then delete the product
            if (product.shop.shopGroup.id == shopGroupId) {
                Product.destroy({ where: { id: productId } })
                    .then(() => {
                        return res.status(200).json({
                            message: 'Product deleted successfully'
                        });
                    })
                    .catch(err => {
                        // console.log(err);
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
            // console.log(err);
            return res.status(500).json({
                message: 'Internal server error'
            });
        });
}