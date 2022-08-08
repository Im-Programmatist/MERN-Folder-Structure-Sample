import { loginUser as _login } from '../services/login.service.js';

async function login(req, res, next) {
  	const callback = (status, message) => {
		res.status = status;
		res.info = message;
		//res.send(message); 
		// OR - res.end( 'Current value does not match');
		if(status>200)		
			res.render("login",{flashMessage:{"message":message.message,isFlash:true}});
		else
			res.redirect("/");
	}
	try {
		const result = await _login(req.body,callback,res);
		//res.status(200).json(await _create(req.body));
	} catch (err) {
		console.error(`Error while login - `, err.message);
		return res.render("login",{flashMessage:{"message":err.message,isFlash:true}});
		//next(err);
	}
}

export default {
  login
};
