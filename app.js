const express = require('express');
const app = new express();
const mysql = require('mysql');
const path = require('path');
const http = require('http');
const bodyParser = require('body-parser');

const db_config = {   
    host: 'mysql-5.5.chaiyohosting.com',
    port: 3306,
    user: 'admin1',
    password: 'W4d3$v5m',
    database: 'span_db'
}
var connection;
function handleDisconnect() {
    connection = mysql.createConnection(db_config); // Recreate the connection, since
    // the old one cannot be reused.

    connection.connect(function(err) { // The server is either down
        if (err) { // or restarting (takes a while sometimes).
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
        } // to avoid a hot loop, and to allow our node script to
    }); // process asynchronous requests in the meantime.
    // If you're also serving http, display a 503 error.
    connection.on('error', function(err) {
        console.log('db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
            handleDisconnect(); // lost due to either server restart, or a
        } else { // connnection idle timeout (the wait_timeout
            throw err; // server variable configures this)
        }
    });
}

handleDisconnect();

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

var server = http.createServer(app);

server.on('clientError', (err, socket) => {
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});
var port = process.env.PORT || 80
server.on('error',   (e)  =>  {   
    if  (e.code  ===  'EADDRINUSE')  {     
        console.log('Address in use, retrying...');     
        setTimeout(()  =>  {       
            server.close();       
            server.listen(port);     
        },  1000);   
    } 
});

server.listen(port,  function ()  {
    global.mysql = connection
    console.log(`Webserver is ready and listening on port ${port}`);
    console.log('opened server on',  server.address());
});