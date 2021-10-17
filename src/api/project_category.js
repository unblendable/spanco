const router = require('express').Router();

const handleResponse = function(res, data){
    res.set('Content-Type', 'application/json')
    res.status(200).send({
        status: 200,
        data: data
    })
}
const category_list = async function(req, res){
    mysql.query("SELECT * FROM project_category", (err, result)=>{
        if(err) throw err
        return handleResponse(res, result)
    })
}

router
    .get('/list', category_list)

module.exports = router;