import multer from 'multer';
import { storage } from '../config/cloudinary.js';

export default multer({ storage }).single('image');