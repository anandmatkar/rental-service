// middleware.js
const session = require('express-session');
const express = require("express")
const app = express()
const cookieParser = require('cookie-parser');
app.use(cookieParser());


const sessionMiddleware = session({
    secret: 'RentoPlaceService',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
});

const sessionDetailsMiddleware = (req, res, next) => {
    // res.cookie("lat", req.query.lat);
    // res.cookie("lon", req.query.lon);
    if (!req.cookies.lat || !req.cookies.lon) {
        req.cookies.lat = null
        req.cookies.lon = null
        next();
    } else {
        next();
    }

};

module.exports = {
    sessionDetails: sessionDetailsMiddleware,
};
