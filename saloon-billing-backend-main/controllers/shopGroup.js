const ShopGroup = require('../models/shopGroup');

//CRUD Controllers

//get shopGroup by id
exports.getShopGroup = (req, res, next) => {
    const shopGroupId = req.user.shopGroupId;
    ShopGroup.findByPk(shopGroupId)
        .then(shopGroup => {
            if(!shopGroup) {
                return res.status(404).json({message: 'Shop group not found'});
            }
            return res.status(200).json({shopGroup: shopGroup});
        })
        .catch(err => {
            console.log(err);
            return res.status(501).send('Internal server error');
        });
}


//create shopGroup
exports.createShopGroup = (req, res, next) => {
    const { name } = req.body;
    ShopGroup.create({
        name: name,
    })  
        .then(result => {
            return res.status(201).json({
                message: 'Created shopGroup successfully!',
                shopGroup: result
            });
        })
        .catch(err => {
            console.log(err);
            return res.status(501).send('Internal server error');
        });
}

