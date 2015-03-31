module.exports = function(connection) {

    var User = require('./user')(connection);
    var Person = require('./person')(connection);
    var Regimen = require('./regimen')(connection);

    return {
        user: User,
        person: Person,
        regimen: Regimen
    }
}