const router = require('express').Router();
const multer = require('multer')
const today = new Date()
const multipartUpload = multer({
        storage: multer.diskStorage({
            destination: function (req, file, callback) { callback(null, 'public/images/uploads');},
            filename: function (req, file, callback) { callback(null, file.originalname.split('.').join('-bl-'+today.getHours()+'.'));}
        })
    });
const handleResponse = function(res, data){
    res.set('Content-Type', 'application/json')
    res.status(200).send({
        status: 200,
        data: data
    })
}
const blog_list = async function(req, res){
    let pageSize = req.query.pageSize > 0 ? +req.query.pageSize : 5
    let page = req.query.page > 0 ? +req.query.page : 1
    let start = (page - 1) * pageSize
    let binding = [start, pageSize]
    mysql.query("SELECT *, (SELECT COUNT(id) FROM blog) total FROM blog ORDER BY id DESC LIMIT ? , ? ", binding, (err, result)=>{
        if(err) throw err
        return handleResponse(res, result)
    })
}
const add_blog = async function(req, res){
    var filename = req.file ? req.file.filename : null
    var binding = [
        filename,
        req.body.title,
        req.body.tag,
        req.body.body
    ]
    var sql = "INSERT INTO blog(title_img, title, tag, body) VALUES(?, ?, ?, ?) ";
    mysql.query(sql, binding, (err, result)=>{
        if(err) throw err
        result.filename = filename
        return handleResponse(res, result);
    })
}
const edit_blog = async function(req, res){
    var binding = []
    if(req.file){
        var filename = req.file.filename
        binding = [filename, req.body.title, req.body.tag, req.body.body, req.body.id]
        var sql = "UPDATE blog SET title_img = ? , title = ? , tag = ? , body = ? , created_at = NOW() WHERE id = ? ";
        mysql.query(sql, binding, (err, result)=>{
            if(err) throw err
            return handleResponse(res, result)
        })
    }else{
        binding = [req.body.title, req.body.tag, req.body.body, req.body.id]
        var sql = "UPDATE blog SET title = ? , tag = ? , body = ? , created_at = NOW() WHERE id = ? ";
        mysql.query(sql, binding, (err, result)=>{
            if(err) throw err
            return handleResponse(res, result)
        })
    }
}

const del_blog = async function(req, res){
    if(req.body.id && req.body.created_at){
        let binding = [req.body.id]
        let sql = "DELETE FROM blog WHERE id = ? ";
        mysql.query(sql, binding, (err, result)=>{
            if(err) throw err
            return handleResponse(res, result)
        }) 
    }else{
        return handleResponse(res, 'Item not found.');
    }
}
router
    .get('/list', blog_list)
    .post('/add', multipartUpload.single('file') ,add_blog)
    .post('/update', multipartUpload.single('file') ,edit_blog)
    .post('/remove', del_blog)
module.exports = router;