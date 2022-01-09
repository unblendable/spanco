const router = require('express').Router();
const handleResponse = function(res, data){
    res.set('Content-Type', 'application/json')
    res.status(200).send({
        status: 200,
        data: data
    })
}
const contact_list = function(req, res){
    mysql.query("SELECT * FROM contact WHERE deleted_at IS NULL ORDER BY id DESC", (err, result)=>{
        if(err) return err
        return handleResponse(res, result)
    })
}

const inquire_list = function(req, res){
    mysql.query("SELECT * FROM inquire WHERE deleted_at IS NULL ORDER BY id DESC", (err, result)=>{
        if(err) return err
        return handleResponse(res, result)
    })
}

const add_contact = function(req, res){
    let sql = "INSERT INTO contact(fullname, email, subject, message) VALUES(?, ?, ?, ?) ";
    const {fullname, subject, email, message} = req.body
    let binding = [fullname, email, subject, message]
    mysql.query(sql, binding, (err, result)=>{
        if(err) return err
        return handleResponse(res, result)
    })
    
}

const add_inquire = function(req, res){
    let sql = "INSERT INTO inquire(fname, lname, phone, service_name, message) VALUES(?, ?, ?, ?, ?) ";
    const {fname, lname, phone, service_name, message} = req.body
    let binding = [fname, lname, phone, service_name, message]
    mysql.query(sql, binding, (err, result)=>{
        if(err) return err
        return handleResponse(res, result)
    })
    
}

const contact_del = function(req, res){
    let binding = [req.body.id]
    let sql = "UPDATE contact SET deleted_at  = NOW() WHERE id = ? "
    mysql.query(sql, binding, (err ,result)=>{
        if(err) return err
        return handleResponse(res, result)
    })
}

const inquire_del = function(req, res){
    let binding = [req.body.id]
    let sql = "UPDATE inquire SET deleted_at  = NOW() WHERE id = ? "
    mysql.query(sql, binding, (err ,result)=>{
        if(err) return err
        return handleResponse(res, result)
    })
}

router
    .get('/contact_list', contact_list)
    .get('/inquire_list', inquire_list)
    .post('/contact_push', add_contact)
    .post('/inquire_push', add_inquire)
    .post('/contact_del', contact_del)
    .post('/inquire_del', inquire_del)
module.exports = router;