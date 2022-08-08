import jwt from "jsonwebtoken";
import { User } from "../models/users.model.js";

export const jwtTokenGenerate = (err, req, res, next) => {
    //Simple token 
    var tokenSample = jwt.sign({ email: req.body.email },  process.env.JWT_SECRETE_KEY, { expiresIn: 60 * 60 });
	// sign with RSA SHA256 - create token
    var tokenRSA = jwt.sign({ email: req.body.email },  process.env.JWT_SECRETE_KEY, { algorithm: 'RS256'},{ expiresIn: 60 * 60 });
	next();
}

export const jwtAuthVerify =  async (req, res, next) => {
    try{
        let token = req.cookies.jwt;
        if(token==undefined && req.path == "/experience"){
            res.status(200).render("login",{flashMessage:{"message":"You must have to login in order to see this `my resume` page",isFlash:true}});
        }
        else if(token==undefined && req.path == "/login"){
            if(req.cookies.fullName!==undefined)
                res.render("login",{flashMessage:{"message":`${req.cookies.fullName}, you are logout successfully!`,isFlash:true}});
            else
                res.render("login");
        }else if(token!==undefined && req.path == "/login"){
            return res.status(400).redirect("/");
        }else{
            let verify = jwt.verify(token,  process.env.JWT_SECRETE_KEY);
            const userDbToken = await User.findOne({_id:verify._id})
            if(userDbToken.username==undefined){
                res.status(400).send({"error":"Invalid token provided"});
            }else{
                req.token = token;
                req.user = userDbToken;
                next();
            }
        }
    }
    catch(error){
        //res.status(400).send({"error":error});
        res.status(400).redirect("/login")
    }
   
}