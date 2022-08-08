import { Contact } from "../models/contact.model.js";
//const UserSchema = new mongoose.model('User', User); 
export const create = async(request) => {
    let queryResult = {};
    try{
        delete request.re_pass;
        delete request.signup;
        const contactRecord = new Contact(request);
        const docResult = await contactRecord.save();
        queryResult.message = 'Contact form submitted successfully!';
        queryResult.status = 200;
        queryResult.result = docResult;
    }
    catch(err){
        queryResult.message = 'Error in creating user!';
        queryResult.error = err.message;
        queryResult.status = 401;
    }

    return queryResult;

}//END createOneDocument
