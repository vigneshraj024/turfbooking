import express from 'express';
import {
  createCoachingTiming,
  getCoachingTimings,
  updateCoachingTiming,
  deleteCoachingTiming
} from '../Controller/coachingcontroller.js';

const router = express.Router();

// GET /api/coaching-timings - Get all coaching class timings
router.get('/', getCoachingTimings);

// POST /api/coaching-timings - Create new coaching class timing
router.post('/', createCoachingTiming);

// PUT /api/coaching-timings/:id - Update coaching class timing
router.put('/:id', updateCoachingTiming);

// DELETE /api/coaching-timings/:id - Delete coaching class timing
router.delete('/:id', deleteCoachingTiming);

console.log("Coaching routes loaded");

export default router;
