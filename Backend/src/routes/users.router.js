import { Router } from 'express';
const router = Router();
import userCtl from '../controllers/users.controller.js';
 
/* POST programming language */
router.get('/:fname?/:lname?/:email?', userCtl.fetch);
router.put('/:fname?/:lname?/:email?', userCtl.update);
router.patch('/:id', userCtl.patch);
router.post('/', userCtl.create);
router.delete('/:id?/:fname?/:lname?/:email?', userCtl.delete_user);

export default router;
