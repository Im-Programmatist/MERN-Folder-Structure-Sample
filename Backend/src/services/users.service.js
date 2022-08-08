import { User } from "../models/users.model.js";
import mongoose from  "mongoose";

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

export const create = async(request) => {
    let queryResult = {};
    try{
        const userRecord = new User(request);
        const docResult = await userRecord.save();
        return responseFormat('success','User', 'created',docResult,null);
    }
    catch(err){
        return responseFormat('fail','User', 'creation',null,err);
    }

    return queryResult;

}//END create user

export const fetch = async(request) => {
    
    try{
        let docResult = {};
        if(request.params.fname == undefined && request.params.lname == undefined && request.params.email == undefined){
            docResult = await User.find();
        }else{
            docResult = await User.find({$or: [{"fname": request.params.fname},
            {"lname": request.params.lname},{"email":request.params.email}]})
            .collation(
                { locale: 'en', strength: 2 }
            );//for case insensetive query for all name and email
        }
        return responseFormat('success','User', 'fetched',docResult,null);
    }
    catch(err){
        return responseFormat('fail','User', 'fetching',null,err);
    }
}//END fetch users

export const update = async(request) => {

    try{
        const docResult = await User.updateMany({$or: [{"fname": request.params.fname},
        {"lname": request.params.lname},{"email":request.params.email}]}, {$set: request.body})
        .collation(
            { locale: 'en', strength: 2 }
        );//for case insensetive query for all name and email
        return responseFormat('success','User', 'details update',docResult,null);
    }
    catch(err){
        return responseFormat('fail','User', 'updating',null,err);
    }
}//END update users

export const updateById = async(request) => {

    try{
        const docResult = await User.findByIdAndUpdate({"_id":request.params.id},request.body,{new:true});
        return responseFormat('success','User', 'details update by id',docResult,null);
    }
    catch(err){
        return responseFormat('fail','User', 'updating by id',null,err);
    }
}//END update by id

export const deleteUser = async(request) => {
    try{
        const docResult = await User.findOneAndDelete({$or: [{"_id":request.params.id},{"fname": request.params.fname},
        {"lname": request.params.lname},{"email":request.params.email}]})
        .collation(
            { locale: 'en', strength: 2 }
        );//for case insensetive query for all name and email
        return responseFormat('success','User', 'details delete',docResult,null);
    }
    catch(err){
        return responseFormat('fail','User', 'deleting',null,err);
    }
}//END delete users

