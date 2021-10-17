const router = require('express').Router();
const handleResponse = function(res, data){
    res.set('Content-Type', 'application/json')
    res.status(200).send({
        status: 200,
        data: data
    })
}
const list = async function(req, res){
    mysql.query("SELECT id, name_th, name_en FROM provinces", (err, result)=>{
        if(err) throw err
        return handleResponse(res, result)
    })
}

router
    .get('/list', list)
module.exports = router;