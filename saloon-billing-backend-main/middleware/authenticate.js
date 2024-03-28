const jwt = require('jsonwebtoken');
require('dotenv').config();


function authenticateToken(req, res, next) {
    const bearerHeader = req.header('Authorization');

    // Check if the Authorization header is present and in the correct format
    if (!bearerHeader || !/^Bearer /i.test(bearerHeader)) {
        return res.status(401).send('Access Denied');
    }

    // Extract the token using regex to handle different formats of the Authorization header
    const token = bearerHeader.replace(/^Bearer /i, '');
    console.log(token);
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) {
            console.error(err); // Log the error for debugging purposes
            return res.status(403).send('Invalid Token');
        }
        req.user = user;
        console.log(req.user);
        next();
    });
}

module.exports = authenticateToken;
