import express from 'express';
import auth from '../middlewares/auth.js';
import categoriesCtrl from '../controllers/categories.controller.js';

const router = express.Router();

//router.post('/', auth, categoriesCtrl.create);
router.get('/', categoriesCtrl.findAll);

export default router;