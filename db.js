var mysql = require('mysql2');


var db_config = {
    // host: 'mysql-5.5.chaiyohosting.com',
    host: '127.0.0.1',
    port: 3306,
    // user: 'admin2',
    // password: 'uxJ8b6#9',
    user: 'root',
    password: 'banana',
    database: 'span_ldb',
    multipleStatements: true
};
var connection;

function handleDisconnect() {
    console.log('connecting to db ...')
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



module.exports = connection;

