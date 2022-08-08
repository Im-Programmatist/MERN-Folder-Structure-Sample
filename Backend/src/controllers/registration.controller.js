import { create as _create, fetch as _fetch, update as _update } from '../services/registration.service.js';

async function create(req, res, next) {
    //Checking middleware
    //console.log("request time is : ",req.requestTime);
    try {
        let result = {};
        if(req.body.update == "Update"){
            result = await _update(req.body,req.params.id);
        }
        else
            result = await _create(req.body,res);

        if(result.status>200){
            return res.render("registration",{flashMessage:{"message":result.error,isFlash:true}});
        }else{
            let fullName = `${req.body.fname} ${req.body.lname}`;
            res.cookie('fullName',fullName,{
                expires:new Date(Date.now() + 300000),
                httpOnly:true
            });
            //res.status(200).render("index");
            res.status(200).redirect("/");
        }
    } catch (err) {
        console.error(`Error while creating user(controller)`, err.message);
        next(err);
    }
}
async function fetch(req, res, next) {
    try {
        const result = await _fetch(req);
        let obj = {
            isFlash:false,
            isName : (req.cookies.fullName !== undefined) ? true : false,
            name: req.cookies.fullName,
            result: result.result
        }
        res.render("registration",{flashMessage:obj});
    } catch (err) {
        console.error(`Error while fetching users - `, err.message);
        next(err);
    }
}

export default {
    create,
    fetch
};
