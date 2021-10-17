const router = require('express').Router();
const handleResponse = function(res, data){
    res.set('Content-Type', 'application/json')
    res.status(200).send({
        status: 200,
        data: data
    })
}
const contact_list = async function(req, res){
    return handleResponse(res, 'some')
}

const add_contact = async function(req, res){
    let sql = "INSERT INTO contact(fullname, email, subject, message) VALUES(?, ?, ?, ?) ";
    const {fullname, subject, email, message} = req.body
    let binding = [fullname, email, subject, message]
    mysql.query(sql, binding , (err, result)=>{
        if(err) throw err
        return handleResponse(res, result)
    })
}

const add_inquire = async function(req, res){
    let sql = "INSERT INTO inquire(fname, lname, phone, service_name, message) VALUES(?, ?, ?, ?, ?) ";
    const {fname, lname, phone, service_name, message} = req.body
    let binding = [fname, lname, phone, service_name, message]
    mysql.query(sql, binding , (err, result)=>{
        if(err) throw err
        return handleResponse(res, result)
    })
}

router
    .get('/list', contact_list)
    .post('/contact_push', add_contact)
    .post('/inquire_push', add_inquire)

module.exports = router;