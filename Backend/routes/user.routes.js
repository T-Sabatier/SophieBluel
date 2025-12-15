import express from 'express';
import userCtrl from '../controllers/users.controller.js';

const router = express.Router();

router.post('/login', userCtrl.login);
//router.post('/signup', userCtrl.signup);

export default router;