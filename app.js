const express = require('express');
const app = new express();
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');
const sql = require('./db');

app.use(bodyParser.raw());
app.use(bodyParser.json({ limit: "100mb", parameterLimit: 1000000 }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true, parameterLimit: 1000000 }));

app.use('/old', express.static(path.join(__dirname, '/old_web')));
app.use('/', express.static(path.join(__dirname, '/frontend')));
app.use('/static', express.static(path.join(__dirname, "/dist/static/")));
app.use(express.static(path.join(__dirname, '/public')));
app.get('/backend', function (req, res) {
    res.sendFile('index.html', { root: path.join(__dirname, '/dist/') });
});
app.use(function (req, res, next) {
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

var server = http.createServer(app);
server.on('clientError', (err, socket) => {
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
var port = process.env.PORT || 80
server.on('error', (e) => {
    if (e.code === 'EADDRINUSE') {
        console.log('Address in use, retrying...');
        setTimeout(() => {
            server.close();
            server.listen(port);
        }, 1000);
    }
});

server.listen(port, function () {
    global.mysql = sql
    console.log(`Webserver is ready and listening on port ${port}`);
    console.log('opened server on', server.address());
});

setInterval(() => {
    sql.query("SELECT 'renew connection'", [], (err, data)=>{
        if(err) console.log(err)
        else console.log('connection refresh')
    })
}, 10000);