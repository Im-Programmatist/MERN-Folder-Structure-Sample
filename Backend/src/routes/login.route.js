import { Router } from 'express';
const router = Router();
import loginCtl from '../controllers/login.controller.js';
 
/* POST programming language */
router.post('/', loginCtl.login);

router.get('/', (req, res) => {
	if(req.cookies.fullName!==undefined)
		res.render("login",{flashMessage:{"message":`${req.cookies.fullName}, you are logout successfully!`,isFlash:true}});
	else
		res.render("login");
});

export default router;
