module.exports = function(app){
    app.use('/banner', require('./banner'))
    app.use('/service', require('./service'));
    app.use('/project', require('./project'));
    app.use('/project_category', require('./project_category'));
    app.use('/contact', require('./contact'));
    app.use('/blog', require('./blog'));
    app.use('/province', require('./province'));
}