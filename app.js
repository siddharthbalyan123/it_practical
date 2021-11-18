const express = require('express');
const path = require('path');
const app = express();
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

//try
const https = require("https");
const qs = require("querystring");
const parseUrl = express.urlencoded({ extended: false });
const parseJson = express.json({ extended: false });

dotenv.config({ path: './.env'});
const db = require('./model/db');
const { JsonWebTokenError } = require('jsonwebtoken');

app.use(express.urlencoded({extended : false}));
app.use(express.json());
app.use(cookieParser());	

app.set('view engine', 'hbs');

const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

db.start.connect((error) => {
    if(error) {
        console.log(error)
    }else{
        console.log('Mysql Connected!');
    }
})

//define routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));


app.listen(5000, () => {
    console.log("Server started on port 5000")
});