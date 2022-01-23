const router = require('express').Router();
const multer = require('multer')
const today = new Date()
const multipartUpload = multer({
        storage: multer.diskStorage({
            destination: function (req, file, callback) { callback(null, 'public/images/uploads');},
            filename: function (req, file, callback) { callback(null, file.originalname.split('.').join('-sv-'+today.getHours()+'.'));},
            limits: { fieldSize: 25 * 1024 * 1024 }
        })
    });
const handleResponse = function(res, data){
    res.set('Content-Type', 'application/json')
    res.status(200).send({
        status: 200,
        data: data
    })
}
const service_list = async function(req, res){
    let pageSize = req.query.pageSize > 0 ? +req.query.pageSize : 5
    let page = req.query.page > 0 ? +req.query.page : 1
    let start = (page - 1) * pageSize
    let binding = [start, pageSize]
    mysql.query("SELECT *, (SELECT COUNT(id) FROM services) total FROM services ORDER BY id DESC LIMIT ? , ? ", binding, (err, result)=>{
        if(err) throw err
        return handleResponse(res, result)
    })
}
const add_service = async function(req, res){
    var filename = req.file ? req.file.filename : null
    var binding = [
        req.body.title || null,
        req.body.body || null,
        filename,
    ]
    var sql = "INSERT INTO services(title, body, title_img) VALUES(?, ?, ?) ";
    mysql.query(sql, binding, (err, result)=>{
        if(err) throw err
        result.filename = filename
        return handleResponse(res, result);
    })
}
const edit_service = async function(req, res){
    var binding = []
    if(req.file){
        var filename = req.file.filename
        binding = [filename, req.body.title, req.body.body, req.body.id]
        var sql = "UPDATE services SET title_img = ? , title = ? , body = ? , created_at = NOW() WHERE id = ? ";
        mysql.query(sql, binding, (err, result)=>{
            if(err) throw err
            return handleResponse(res, result)
        })
    }else{
        binding = [req.body.title, req.body.body, req.body.id]
        var sql = "UPDATE services SET title = ? , body = ? , created_at = NOW() WHERE id = ? ";
        mysql.query(sql, binding, (err, result)=>{
            if(err) throw err
            return handleResponse(res, result)
        })
    }
}

const del_service = async function(req, res){
    if(req.body.id && req.body.created_at){
        let binding = [req.body.id]
        let sql = "DELETE FROM services WHERE id = ? ";
        mysql.query(sql, binding, (err, result)=>{
            if(err) throw err
            return handleResponse(res, result)
        }) 
    }else{
        return handleResponse(res, 'Item not found.');
    }
}

const store_img = async function(req, res){
    console.log(req.file)
    return 
}

router
    .get('/list', service_list)
    .post('/add', multipartUpload.single('file') ,add_service)
    .post('/update', multipartUpload.single('file') ,edit_service)
    .post('/remove', del_service)
    .post('/store_img', multipartUpload.single('file'), store_img)
module.exports = router;