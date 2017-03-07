let Users=require('./usersModel.js');

let jwt = require('jwt-simple');

module.exports={
	signup: function(req, res, next) {
		let username=req.body.username;
		let password=req.body.password;
		let email=req.body.email;
		Users.findOne({username: username})
		.then(function(user) {
			if(user) {
				next(new Error('user already exist'));
			}else{
				 return Users.create({username: username, password: password
					 , email: email});
			}
		})
		.then(function(user) {
  // create token
  let token=jwt.encode(user, 'secret');
  	res.json({token: token});
		});


	},
	signin: function(req, res, next) {
		let username=req.body.username;
		let password=req.body.password;
		Users.findOne({username: username})
		.then(function(user) {
			if(!user) {
				next(new Error('user does not exist'));
			}else{
		let token=jwt.encode(user, 'secret');
		res.json({token: token});

			}
		});

	},
};
