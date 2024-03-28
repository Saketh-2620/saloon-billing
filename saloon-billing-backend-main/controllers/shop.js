const Shop = require('../models/shop');
const User = require('../models/user');
const ShopGroup = require('../models/shopGroup');
const bcrypt = require('bcrypt');
const saltRounds = 12;

//get shop by id
exports.getShop = (req, res, next) => {
    const shopId = req.body.id;
    Shop.findByPk(shopId, {
        include: [{
          model: ShopGroup,
          attributes:['id','name']
        }]
      })
        .then(shop => {
            if(!shop) {
                return res.status(404).json({message: 'Shop not found'});
            }
            console.log(shop.shopGroupId);
            return res.status(200).json({shop: shop});
        })
        .catch(err => {
            console.log(err);
            return res.status(501).send('Internal server error');
        });
}

exports.getAllShopsOfUser = (req, res, next) => {
    Shop.findAll({
        where: {
            shopGroupId: req.user.shopGroupId
        }
    })
        .then(shops => {
            if(!shops) {
                return res.status(404).json({message: 'Shops not found'});
            }
            return res.status(200).json({shops: shops});
        })
        .catch(err => {
            console.log(err);
            return res.status(501).send('Internal server error');
        });
}

// exports.createShopAndUser = (req, res, next) => {
//     const { name, username, password } = req.body;
//     const hashedPassword = 
//     const shopGroupId = req.user.shopGroupId;
//     ShopGroup.findByPk(shopGroupId)
//         .then(shopGroup => {
//             if(!shopGroup) {
//                 return res.status(404).json({message: 'Shop group not found'});
//             }
//             Shop.create({
//                 name: name,
//                 shopGroupId: shopGroupId
//             })
//                 .then(shop => {
//                     if(!shop) {
//                         return res.status(404).json({message: 'Shop creation failed'});
//                     }
//                     shopGroup.createShopManager({
//                         username: username,
//                         password: password
//                     })
//                         .then(user => {
//                             if(!user) {
//                                 return res.status(404).json({message: 'User not found'});
//                             }
//                             return res.status(200).json({message: 'Shop and user created successfully!'});
//                         })
//                         .catch(err => {
//                             console.log(err);
//                             return res.status(501).send('Internal server error');
//                         });
//                 })
//                 .catch(err => {
//                     console.log(err);
//                     return res.status(501).send('Internal server error');
//                 });
//         })
//         .catch(err => {
//             console.log(err);
//             return res.status(501).send('Internal server error');
//         });
// }



//delete shop if user has role shop_manager and shop belongs to the shopgroup of the user
exports.deleteShop = (req, res, next) => {
    const shopId = req.body.id;
    Shop.findByPk(shopId)
        .then(shop => {
            if(!shop) {
                return res.status(404).json({message: 'Shop not found'});
            }
            if(shop.shopGroupId != req.user.shopGroupId) {
                return res.status(401).json({message: 'Unauthorized'});
            }
            shop.destroy();
            return res.status(200).json({message: 'Shop deleted successfully!'});
        })
        .catch(err => {
            console.log(err);
            return res.status(501).send('Internal server error');
        });
}

//update shop if user has role shop_manager and shop belongs to the shopgroup of the user
exports.updateShop = (req, res, next) => {
    const shopId = req.body.id;
    const { name, shopGroupId } = req.body;
    Shop.findByPk(shopId)
        .then(shop => {
            if(!shop) {
                return res.status(404).json({message: 'Shop not found'});
            }
            if(shop.shopGroupId != req.user.shopGroupId) {
                return res.status(401).json({message: 'Unauthorized'});
            }
            shop.name = name;
            shop.shopGroupId = shopGroupId;
            shop.save();
            return res.status(200).json({message: 'Shop updated successfully!'});
        })
        .catch(err => {
            console.log(err);
            return res.status(501).send('Internal server error');
        });
}