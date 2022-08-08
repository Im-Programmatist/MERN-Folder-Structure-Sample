import { Router } from 'express';
const router = Router();
import registrationCtl from '../controllers/registration.controller.js';
 
/* POST programming language */
router.post('/:id?', registrationCtl.create);
router.get('/fetchExistingUserInfo/', registrationCtl.fetch);
router.get('/', (req, res) => {
	let obj = {
		isFlash:false,
		isName : (req.cookies.jwt !== undefined) ? true : false,
		name: req.cookies.fullName
	}
	res.render("registration",{flashMessage:obj});
});

export default router;
