import mongoose from "mongoose";
import { User } from "../models/users.model.js";
//const UserSchema = new mongoose.model('User', User); 

export const loginUser = async(request,callback,res) => {
    const loginResult = await User.findOne({ username: request.username }).exec(function (error, user) {
		if (error || !user) {
			callback(400, {"status_code":400, "status":"fail", "message":"Invalid Credentials!"});
		} else {
			user.comparePassword(request.hashedPassword, function (matchError, isMatch) {
				if (matchError || !isMatch) {
					callback(400, {"status_code":400, "status":"fail", "message":"Invalid Credentials!"});
				} else {
					let fullName = `${user.fname} ${user.lname}`;
					res.cookie('fullName',fullName,{
						expires:new Date(Date.now() + 300000),
						httpOnly:true
					});
					//this generateToken returns promise so until we wait call back get call already so cookies not get set 
					//For this we have to resolve promise then run further code  
					user.generateToken().then(function(val) {
						console.log("Genarete for further actions, Token is - ", val);
						var token = val;
						res.cookie('jwt',token,{
							expires:new Date(Date.now() + 300000),
							httpOnly:true
						});						
						callback(200, {"status_code":200, "status":"success", "message":"Successfully login!"});
					});
        		}
			})
		}
    })
}