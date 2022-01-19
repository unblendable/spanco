const router = require('express').Router();
const multer = require('multer')
const today = new Date()
const multipartUpload = multer({
        storage: multer.diskStorage({
            destination: function (req, file, callback) { callback(null, 'public/images/uploads');},
            filename: function (req, file, callback) { callback(null, file.originalname.split('.').join('-pj-'+today.getHours()+'.'));}
        })
    });
const handleResponse = function(res, data){
    res.set('Content-Type', 'application/json')
    res.status(200).send({
        status: 200,
        data: data
    })
}
const project_list = async function(req, res){
    let pageSize = req.query.pageSize > 0 ? +req.query.pageSize : 5
    let page = req.query.page > 0 ? +req.query.page : 1
    let start = (page - 1) * pageSize
    let binding = [start, pageSize]
    var sql = `SELECT
                projects.*,
                project_category.id AS category_id,
                project_category.name AS category_name,
                (SELECT COUNT(id) FROM projects) AS total
            FROM projects 
            LEFT JOIN project_category ON project_category.id = projects.category_id
            ORDER BY id DESC
            LIMIT ? , ?  `;
    mysql.query(sql, binding, (err, result)=>{
        if(err) throw err
        return handleResponse(res, result)
    })
}

const project_detail = async function(req, res){
    let id = req.body.id
    if(!(id > 0)) return handleResponse(res, [])
    mysql.query('SELECT * FROM projects WHERE id = ? ', [id], (err, result)=>{
        if(err) throw err
        return handleResponse(res, result)
    })
}

const add_project = async function(req, res){
    var filename = req.file ? req.file.filename : null
    var binding = [
        filename,
        req.body.title,
        req.body.tag,
        req.body.location,
        req.body.owner,
        req.body.consultants,
        req.body.category_id,
        req.body.start_year,
        req.body.end_year,
        req.body.body
    ]
    var sql = `INSERT INTO projects(title_img, title, tag, location, owner, consultants, category_id, start_year, end_year, body) 
                VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?) `;
    mysql.query(sql, binding, (err, result)=>{
        if(err) throw err
        result.filename = filename
        return handleResponse(res, result);
    })
}
const edit_project = async function(req, res){
    var binding = [
        req.body.title, 
        req.body.tag, 
        req.body.location, 
        req.body.owner, 
        req.body.consultants, 
        req.body.category_id, 
        req.body.start_year, 
        req.body.end_year, 
        req.body.body, 
        req.body.id
    ]
    if(req.file){
        var filename = req.file.filename
        binding.unshift(filename)
        var sql = `UPDATE projects SET 
                        title_img = ? , 
                        title = ? , 
                        tag = ? , 
                        location = ? , 
                        owner = ? ,
                        consultants = ? ,
                        category_id = ? ,
                        start_year = ? ,
                        end_year = ? ,
                        body = ? , 
                        created_at = NOW() 
                    WHERE id = ? `;
        mysql.query(sql, binding, (err, result)=>{
            if(err) throw err
            return handleResponse(res, result)
        })
    }else{
        var sql = `UPDATE projects SET 
                        title = ? , 
                        tag = ? , 
                        location = ? , 
                        owner = ? ,
                        consultants = ? ,
                        category_id = ? ,
                        start_year = ? ,
                        end_year = ? ,
                        body = ? , 
                        created_at = NOW() 
                    WHERE id = ? `;        
        mysql.query(sql, binding, (err, result)=>{
            if(err) throw err
            return handleResponse(res, result)
        })
    }
}

const del_project = async function(req, res){
    if(req.body.id && req.body.created_at){
        let binding = [req.body.id]
        let sql = "DELETE FROM projects WHERE id = ? ";
        mysql.query(sql, binding, (err, result)=>{
            if(err) throw err
            return handleResponse(res, result)
        }) 
    }else{
        return handleResponse(res, 'Item not found.');
    }
}

router
    .get('/list', project_list)
    .post('/add', multipartUpload.single('file') ,add_project)
    .post('/update', multipartUpload.single('file') ,edit_project)
    .post('/remove', del_project)
    .post('/detail', project_detail)

module.exports = router;