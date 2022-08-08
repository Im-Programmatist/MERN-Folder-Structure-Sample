import { User } from "../models/users.model.js";
import jwt from "jsonwebtoken";
//const UserSchema = new mongoose.model('User', User); 

const responseFormat = (respType,module,action,result,err) => {
    let queryResult = {}; 
    if(respType=="success"){
        queryResult.message = `${module} ${action} successfully!!!`;
        queryResult.status = 200;
        queryResult.result = result;
    }else{
        queryResult.message = `${module} ${action} failed!!!`;
        queryResult.error = err.message;
        queryResult.status = 401;;
    }
    return queryResult;
}

export const create = async(request,res) => {
    let queryResult = {};
    try{
        if(request.hashedPassword !== request.re_pass){
            var err = {};
            err.message= "password and confirm password not match";
            return responseFormat('fail','Password', 'confirmation',null,err);
        } 
        delete request.re_pass;
        delete request.signup;
        const userRecord = new User(request);
        const docResult = await userRecord.save();
        //const result = await userRecord.insertMany([userRecord]);
        //const result = await User.insertMany(request, {forceServerObjectId: true},{ordered:true});
        const token = await userRecord.generateToken();
        console.log("created token",token);
        res.cookie('jwt',token,{
            expires:new Date(Date.now() + 300000),
            httpOnly:true
        });	
        return responseFormat('success','User', 'created',docResult,null);	
    }
    catch(err){
        return responseFormat('fail','User', 'creation ',null,err);
    }

}//END createOneDocument

export const fetch = async(request) => {
    try{
        let verify = jwt.verify(request.cookies.jwt,  process.env.JWT_SECRETE_KEY);
        const docResult = await User.findOne({_id:verify._id})
        return responseFormat('success','User', 'fetched',docResult,null);
    }
    catch(err){
        return responseFormat('fail','User', 'fetching',null,err);
    }
}//END fetch users


export const update = async(request,id) => {
    try{
        delete request.re_pass;
        delete request.update;
        if(request.hashedPassword==""){
            delete request.hashedPassword;
        }
        

        const docResult = await User.updateOne({_id:id}, {$set: request}, {new:true});
        return responseFormat('success','User', 'details update',docResult,null);
    }
    catch(err){
        return responseFormat('fail','User', 'updating',null,err);
    }
}//END update users

