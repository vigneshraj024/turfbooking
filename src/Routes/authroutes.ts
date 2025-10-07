import express from 'express';
import { loginAdmin } from '../Controller/authcontroller.js';

const router = express.Router();

router.post('/login', loginAdmin);

export default router;


