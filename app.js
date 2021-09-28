const express = require('express');
const app = new express();
const mysql = require('mysql');
const path = require('path');
const db = mysql.createConnection({   
    host: 'localhost',
    user: 'root',
    password: 'banana',
    database: 'span_db'
})
db.connect()

app.use('/', express.static(path.join(__dirname,'/frontend')));
app.use('/static', express.static(path.join(__dirname,"/dist/static/"))); 
app.get('/backend', function(req,res) {
   res.sendFile('index.html', { root: path.join(__dirname, '/dist/') });
});

app.listen('80', () => {    
    console.log('start port 80')
})
