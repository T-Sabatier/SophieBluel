import express from 'express';
import multer from '../middlewares/multer-config.js';
import auth from '../middlewares/auth.js';
import checkWork from '../middlewares/checkWork.js';
import workCtrl from '../controllers/works.controller.js';

const router = express.Router();

router.post('/', auth, multer, checkWork, workCtrl.create);
router.get('/', workCtrl.findAll);
router.delete('/:id', auth, workCtrl.delete);

export default router;