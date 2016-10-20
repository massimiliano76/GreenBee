module.exports = function(io) {

    var express = require('express');
    var titolo = 'GreenBee';
    var router = express.Router();
    var magazzinoController = require('../controllers/magazzinoController');
    var utenteController = require('../controllers/utenteController');
    var scheduleController = require('../controllers/scheduleController');

    router.get('/', function (req, res) {
        res.render('index', {title: titolo, user: req.user});
    });

    //chat;
    router.get('/chat', function (req, res) {
        res.render('chat', {title: titolo, user: req.user});
    });



    router.get('/logout', function (req, res) {
        req.logout();
        res.redirect('../');
    });

    router.get('/ilMioOrto', function (req, res) {
        var options = {id: req.user._id};
        var magazzinos;
        magazzinoController.listAll(null, function (answer) {
            if (answer[0] == 200) {
                magazzinos = answer[1];
            } else {
                res.render('error', {title: titolo, message: answer[1], status: answer[2]});
            }
        });
        utenteController.getColtivazioni(options, function (answer) {
            if (answer[0] == 200) {
                res.render('ilMioOrto', {
                    title: titolo,
                    user: req.user,
                    coltivazioni: answer[1],
                    magazzino: magazzinos
                });
            } else {
                res.render('error', {title: titolo, message: answer[1], status: answer[2]});
            }
        });
    });

    router.get('/market', function (req, res) {
        magazzinoController.list(null, function (answer) {
            if (answer[0] == 200) {
                res.render('market', {title: titolo, user: req.user, magazzino: answer[1]});
            } else {
                res.render('error', {title: titolo, message: answer[1], status: answer[2]});
            }
        });
    });

    router.post('/addSale', function (req, res) {
        var options = {
            tipoTransazione: req.body.tipoTransazione,
            oggetto: req.body.oggetto,
            quantita: req.body.quantita,
            user: {id: req.user._id}
        };
        utenteController.addTransazione(options, function (answer) {
            if (answer[0] == 200) {
                res.render('addedSale', {title: titolo, user: req.user, sale: answer[1]});
            } else {
                res.render('error', {title: titolo, message: answer[1], status: answer[2]});
            }
        });
    });

    router.post('/addColtivazione', function (req, res) {
        var options = {
            id: req.user._id,
            ortaggio: req.body.coltivazione
        };
        utenteController.addOrtaggio(options, function (answer) {
            if (answer[0] == 200) {
                res.render('addColtivazione', {title: titolo, user: req.user, coltivazione: options.ortaggio});
            } else {
                res.render('error', {title: titolo, message: answer[1], status: answer[2]});
            }
        });
    });

    router.post('/removeColtivazione', function (req, res) {
        var options = {
            id: req.user._id,
            ortaggio: req.body.coltivazione
        };
        utenteController.removeOrtaggio(options, function (answer) {
            if (answer[0] == 200) {
                res.redirect('ilMioOrto');
            } else {
                res.render('error', {title: titolo, message: answer[1], status: answer[2]});
            }
        });
    });

    router.get('/toDoList', function (req, res) {
        scheduleController.list(null, function (answer) {
            if (answer[0] == 200) {
                res.render('toDoList', {title: titolo, user: req.user, toDoList: answer[1]});
            } else {
                res.render('error', {title: titolo, message: answer[1], status: answer[2]});
            }
        });
    });

    router.post('/completeSchedule', function (req, res) {
        utenteController.completeSchedule({scheduleId: req.body.schedule, utenteId: req.user._id}, function (answer) {
            if (answer[0] == 200) {
                res.redirect('toDoList');
            } else {
                res.render('error', {title: titolo, message: answer[1], status: answer[2]});
            }
        });
    });

    io.on('connection', function(socket){
        socket.on('chat message', function(msg){
            io.emit('chat message', {message: msg, 
                username: socket.request.user.username});
        });
    });

    return router;
};