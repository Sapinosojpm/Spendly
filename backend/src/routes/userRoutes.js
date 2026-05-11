import express from 'express';
import { registerUser, getUserProfile } from '../controllers/userController.js';

const router = express.Router();

router.post('/', registerUser);
router.get('/profile/:id', getUserProfile);

export default router;
