import express from 'express';
import { logMessage, getChatHistory, askQuestion } from '../controllers/chatController.js';

const router = express.Router();

router.post('/log', logMessage);
router.post('/ask', askQuestion);
router.get('/history/:userId', getChatHistory);

export default router;
