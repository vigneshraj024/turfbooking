import express from 'express';
import { listAuditLogs } from '../Controller/auditcontroller.js';
const router = express.Router();
router.get('/', listAuditLogs);
export default router;
