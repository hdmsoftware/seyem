module.exports = function(app, passport,models) {

    var api = require('./api.js')(models);

    app.get('/', function(req, res){
        res.render('index');
    });

    app.get('/partials/:name', showClientRequest, function (req, res) {
        var name = req.params.name;
        res.render('partials/' + name);
    });

    app.get('/partials/auth/:name',  showClientRequest, passport.authenticate('local-authorization', {
        session: false
    }),function (req, res) {
        var name = req.params.name;
        res.render('partials/auth/' + name);
    });

    app.get('/partials/regimen/:name', showClientRequest, passport.authenticate('local-authorization', {
        session: false
    }),function (req, res) {
        var name = req.params.name;
        res.render('partials/regimen/' + name);
    });

    app.get('/partials/medication/:name', showClientRequest, passport.authenticate('local-authorization', {
        session: false
    }),function (req, res) {
        var name = req.params.name;
        res.render('partials/medication/' + name);
    });

    app.post('/api/login', showClientRequest, passport.authenticate('local-login', {
        session: false
    }),api.login);

    app.post('/api/signup', showClientRequest, api.signup);


    app.get('/api/logout', showClientRequest, passport.authenticate('local-authorization', {
        session: false
    }),api.logout);

    app.get('/api/people', showClientRequest, passport.authenticate('local-authorization', {
        session: false
    }),api.getPeople);

    app.post('/api/person', showClientRequest, passport.authenticate('local-authorization', {
        session: false
    }),api.createPerson);

    app.put('/api/person/:id', showClientRequest, passport.authenticate('local-authorization', {
        session: false
    }),api.updatePerson);

    app.delete('/api/person/:id', showClientRequest, passport.authenticate('local-authorization', {
        session: false
    }),api.removePerson);

    app.post('/api/regimen', showClientRequest, passport.authenticate('local-authorization', {
        session: false
    }),api.createRegimen);

    app.get('/api/regimens', showClientRequest, passport.authenticate('local-authorization', {
        session: false
    }),api.getRegimens);

    app.delete('/api/regimen/:id', showClientRequest, passport.authenticate('local-authorization', {
        session: false
    }),api.removeRegimen);

   



    function showClientRequest(req, res, next) {
        var request = {
            REQUEST : {
                HEADERS: req.headers,
                BODY : req.body
            }
        }
      //  console.log(request)
        return next();
    }
}