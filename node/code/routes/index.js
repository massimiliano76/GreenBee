var express = require('express');
var passport = require('passport');
var router = express.Router();
var titolo ='GreenBee';

/* GET home page. */
router.get('/',function (req, res) {
	if(req.isAuthenticated()) {
		res.redirect('/user');
  	} else {
		res.render('index', { title: titolo, authMessage: req.flash('authMessage')});
  	}
});

router.post('/login', passport.authenticate('local', {
	successRedirect: '/user',
	failureRedirect: '/',
	failureFlash: true
}));

module.exports = router;
