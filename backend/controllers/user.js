const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


exports.getUsers = (req, res) => {
	const pageSize = +req.query.pageSize; // +sign is to convert string query parameter to numeric
	const currentPage = +req.query.page;
	const userQuery = User.find({role: 'user'}).skip(pageSize * (currentPage - 1))
    .limit(pageSize);;
	
	userQuery.then((users) => {   
        if(users){
            res.status(200).json({
                success: true,
                users: users
            });
        }   
        else{
            res.status(404)
                .json({
                    success: false,
                    message: "No Record Found"
                })
        }  
       
	})
	.catch((error) => {
        res.status(500)
            .json({
                success: false,
                message: error.message
            })
	});
}

exports.getTotalUser = (req, res) => {
	User.find({role: 'user'})
		.then(users => {
			if(users){
				res.status(200).json({
					success: true,
					users: users.length
				})
			}else{
				res.status(404).json({
					success: false,
					users: 0,
					message: "Somethng went wrong"
				})
			}
		})
		.catch(error => {
			res.status(500).json({
				success: false,
				message: error.message
			})
		})
		
}


exports.createUser = (req, res) =>{
	User.findOne({email: req.body.email})
		.then(user =>{
			if(user){
				res.status(200).json({
					success: false,
					message: "User already exist"
				})
				return;
			}
		})

	bcrypt.hash(req.body.password, 15)
		.then(hashedPassword =>{
			const user = new User({email: req.body.email, password: hashedPassword, phone: req.body.phone, firstname: req.body.firstname, lastname: req.body.lastname, role: req.body.role, createdAt: new Date()});
			user.save()
				.then(response => {
					res.status(200)
						.json({
							success: true,
							message: "Sign up successfully"
						});
				})
		})
		.catch(error =>{
			res.status(500)
				.json({
					success: false,
					message: error.message
				})
		})
}

exports.loginUser = (req, res) => {
	User.findOne({email: req.body.email})
		.then(user =>{
			if(user){
				bcrypt.compare(req.body.password, user.password)
					.then(response =>{
						if(response){
							User.updateOne({_id: user._id}, {lastSignIn: new Date()}).then(result => {
								if(result.nModified > 0){
									const token = jwt.sign({user: user}, "secret_should_long_enough",{expiresIn: '1h'});
									user.password = null;
									console.log(user);
									res.status(200)
										.json({
											success: true,
											user: user,
											token: token,
											expiresIn: 3600,
											message: "Login successfully"
										});
								}else{
									res.status(200)
										.json({
											success: false,
											message: "something went wrong"
										});
								}
							})
						}
						else{
							res.status(200)
								.json({
									success: false,
									message: "password is incorrect"
								});
						}
					});
			}
			else{
				res.status(200)
					.json({
						success: false,
						message: "User does not exist"
					});
			}
		})
}



