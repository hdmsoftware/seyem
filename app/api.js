module.exports = function(models) {

    var User = models.user;
    var Person = models.person;
    var Regimen = models.regimen;

    return {

        signup: function(req, res) {

            var body = req.body;

            User.findOne({
                username: body.username
            }, function(err, user) {
                if (err)
                    res.send(500, {
                        'message': err
                    });
                // check to see if theres already a user with that email
                if (user) {
                    res.send(403, {
                        'message': 'User already exist!'
                    });
                } else {
                    var newUser = new User({
                        username: body.username,
                        email: body.email,
                        password: body.password
                    })
                    newUser.save(function(err, user) {
                        if (err) {
                            res.send(500, {
                                'message': err
                            });
                        }
                        res.json({
                            'message': 'User was successfully registered!'
                        });
                    });
                }
            });
        },

        login: function(req, res) {
            res.json({
                auth_token: req.user.token.auth_token
            });
        },

        logout: function(req, res) {
            req.user.auth_token = null;
            req.user.save(function(err, user) {
                if (err) {
                    res.send(500, {
                        'message': err
                    });
                }
                res.json({
                    message: 'See you!'
                });
            });
        },
        createPerson: function(req, res) {
            var person = req.body.person;

            if (typeof person.name != "string") {
                res.send(400, {
                    'message': "Name must be a string!"
                });
            }
            if (typeof person.age != "number") {
                res.send(400, {
                    'message': "Age must be a number!"
                });
            }

            var newPerson = new Person({
                name: person.name,
                age: person.age
            })
            newPerson.save(function(err, user) {
                if (err) {
                    res.send(500, {
                        'message': err
                    });
                }
                res.json({
                    'message': 'Person was successfully added!'
                });
            });

        },
        updatePerson: function(req, res) {
            var _id = req.params.id;
            var person = req.body.person;

            var query = {
                _id: _id
            };
            Person.update(query, {
                name: person.name,
                age: person.age
            }, null, function(err, thing) {
                if (err) {
                    res.send(500, {
                        'message': err
                    });
                }
                res.json({
                    'message': 'Person was successfully updated!'
                });
            })

        },
        removePerson: function(req, res) {
            var _id = req.params.id;

            Person.remove({
                _id: _id
            }, function(err, user) {
                if (err) {
                    res.send(500, {
                        'message': err
                    });
                }
                res.json({
                    'message': 'Person was successfully removed!'
                });
            })


        },
        getPeople: function(req, res) {

            Person.find(function(err, people) {
                res.json({
                    people: people
                });
            })


        },
        createRegimen: function(req, res) {

            //    var request = {
            //     REQUEST : {
            //         HEADERS: req.headers,
            //         BODY : req.body
            //     }
            // }
            //    console.log(request)

            var regimen = req.body.regimen;

            if (typeof regimen.name != "string") {
                res.send(400, {
                    'message': "Name must be a string!"
                });
                return;
            }

            if (regimen.medicationlist.length === 0) {
                res.send(400, {
                    'message': "Medication list cannot be empty!"
                });
                return;
            }

            var newRegimen = new Regimen({
                name: regimen.name,
                medicationlist: regimen.medicationlist
            });

            newRegimen.save(function(err, regimen1) {
                if (err && err.code === 11000) {
                    res.send(400, {
                        'message': "Regimen name already exists."
                    });
                    return;
                }
                if (err) {
                    res.send(500, {
                        'message': err
                    });
                }
                res.json({
                    'message': 'Regimen was successfully created!'
                });
            });
        },
        getRegimens: function(req, res) {
            Regimen.find(function(err, regimens) {
                res.json({
                    regimens: regimens
                });
            })
        },
        removeRegimen: function(req, res) {

            var _id = req.params.id;

            Regimen.remove({
                _id: _id
            }, function(err, regimen) {
                if (err) {
                    res.send(500, {
                        'message': err
                    });
                    return;
                }
                res.json({
                    'message': 'Regimen was successfully removed!'
                });
            })
        }


    }

}