const express = require('express');
const app = new express();
const mysql = require('mysql');
const path = require('path');
const bodyParser = require('body-parser');
const db = mysql.createConnection({   
    host: 'localhost',
    user: 'root',
    password: 'banana',
    database: 'span_db'
})
db.connect()
global.mysql = db

app.use(bodyParser.raw());
app.use(bodyParser.json({ limit: "100mb", parameterLimit: 1000000 }));
app.use(bodyParser.urlencoded({ limit: "100mb",  extended: true, parameterLimit: 1000000 }));

app.use('/', express.static(path.join(__dirname,'/old_web')));
app.use('/new', express.static(path.join(__dirname,'/frontend')));
app.use('/static', express.static(path.join(__dirname,"/dist/static/"))); 
app.use(express.static(__dirname + '/public'));
app.get('/backend', function(req,res) {
   res.sendFile('index.html', { root: path.join(__dirname, '/dist/') });
});
app.use(function(req, res, next) {
    // req.setTimeout(0) // no timeout
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization, x-forwarded-for"
    );
    // res.set('Content-Type', 'application/json')
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});
require('./src/api')(app);
app.listen('80', () => {    
    console.log('start port 80')
})
