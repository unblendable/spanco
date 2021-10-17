const router = require('express').Router();
const multer = require('multer')
const today = new Date();
const multipartUpload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, callback) { callback(null, 'public/images/uploads');},
        filename: function (req, file, callback) { callback(null, file.originalname.split('.').join('-bn-'+today.getHours()+'.'));}
    })
});
const handleResponse = function(res, data){
    res.set('Content-Type', 'application/json')
    res.status(200).send({
        status: 200,
        data: data
    })
}

const banner_list = async function(req, res){
    var sql = "SELECT * FROM main_banner";
    mysql.query(sql, (err, result)=>{
        if(err) throw err
        return handleResponse(res, result)
    })
}

const add_banner = async function(req, res){
    var filename = req.file ? req.file.filename : null
    var binding = [
        filename,
        req.body.title || null,
        req.body.description || null
    ]
    var sql = "INSERT INTO main_banner(filename, title, description) VALUES(?, ?, ?) ";
    mysql.query(sql, binding, (err, result)=>{
        if(err) throw err
        result.filename = filename
        return handleResponse(res, result);
    })
}

const edit_banner = async function(req, res){
    var binding = []
    if(req.file){
        var filename = req.file.filename
        binding = [filename, req.body.title, req.body.description, req.body.id]
        var sql = "UPDATE main_banner SET filename = ? , title = ? , description = ? , created_at = NOW() WHERE id = ? ";
        mysql.query(sql, binding, (err, result)=>{
            if(err) throw err
            return handleResponse(res, result)
        })
    }else{
        binding = [req.body.title, req.body.description, req.body.id]
        var sql = "UPDATE main_banner SET title = ? , description = ? , created_at = NOW() WHERE id = ? ";
        mysql.query(sql, binding, (err, result)=>{
            if(err) throw err
            return handleResponse(res, result)
        })
    }
}

const del_banner = async function(req, res){
    if(req.body.id && req.body.created_at){
        let binding = [req.body.id]
        let sql = "DELETE FROM main_banner WHERE id = ? ";
        mysql.query(sql, binding, (err, result)=>{
            if(err) throw err
            return handleResponse(res, result)
        }) 
    }else{
        return handleResponse(res, 'Item not found.');
    }
}

router
    .get('/list', banner_list)
    .post('/add', multipartUpload.single('file'), add_banner)
    .post('/update', multipartUpload.single('file'), edit_banner)
    .post('/remove', del_banner)
module.exports = router;