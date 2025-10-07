import { Request, Response } from 'express';

export type Sport = 'Cricket' | 'Football' | 'Pickleball' | 'Gaming' | 'Badminton' | 'Party';

export interface CoachingTiming {
  id?: string;
  class_name: string;
  sport: Sport;
  days: string[];
  start_time: string;
  end_time: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// In-memory storage for coaching timings (replace with database later)
let coachingTimings: CoachingTiming[] = [
  {
    id: '1',
    class_name: 'Cricket Coaching',
    sport: 'Cricket',
    days: ['Saturday', 'Sunday'],
    start_time: '09:00',
    end_time: '11:00',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    class_name: 'Football Training',
    sport: 'Football',
    days: ['Monday', 'Wednesday', 'Friday'],
    start_time: '18:00',
    end_time: '20:00',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    class_name: 'Badminton Sessions',
    sport: 'Badminton',
    days: ['Tuesday', 'Thursday'],
    start_time: '16:00',
    end_time: '18:00',
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

let nextId = '4';

// Get all coaching timings
export const getCoachingTimings = async (req: Request, res: Response) => {
  try {
    res.json(coachingTimings);
  } catch (error) {
    console.error('Error getting coaching timings:', error);
    res.status(500).json({ error: 'Failed to get coaching timings' });
  }
};

// Create new coaching timing
export const createCoachingTiming = async (req: Request, res: Response) => {
  try {
    const { class_name, sport, days, start_time, end_time, is_active } = req.body;

    if (!class_name || !days || !start_time || !end_time) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate sport if provided, otherwise default to 'General'
    let timingSport: Sport = 'Party'; // Default sport
    if (sport) {
      const validSports: Sport[] = ['Cricket', 'Football', 'Pickleball', 'Gaming', 'Badminton', 'Party'];
      if (!validSports.includes(sport)) {
        return res.status(400).json({ error: 'Invalid sport. Must be one of: ' + validSports.join(', ') });
      }
      timingSport = sport;
    }

    if (!Array.isArray(days) || days.length === 0) {
      return res.status(400).json({ error: 'Days must be a non-empty array' });
    }

    // Validate time format (HH:MM)
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(start_time) || !timeRegex.test(end_time)) {
      return res.status(400).json({ error: 'Invalid time format. Use HH:MM' });
    }

    // Validate that end time is after start time
    if (start_time >= end_time) {
      return res.status(400).json({ error: 'End time must be after start time' });
    }

    const newTiming: CoachingTiming = {
      id: (parseInt(nextId) + 1).toString(),
      class_name,
      sport: timingSport,
      days,
      start_time,
      end_time,
      is_active: is_active !== undefined ? is_active : true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    coachingTimings.push(newTiming);
    nextId = (parseInt(nextId) + 1).toString();
    res.status(201).json(newTiming);
  } catch (error) {
    console.error('Error creating coaching timing:', error);
    res.status(500).json({ error: 'Failed to create coaching timing' });
  }
};

// Update coaching timing
export const updateCoachingTiming = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Invalid timing ID' });
    }

    const timingIndex = coachingTimings.findIndex(t => t.id === id);

    if (timingIndex === -1) {
      return res.status(404).json({ error: 'Coaching timing not found' });
    }

    const { class_name, sport, days, start_time, end_time, is_active } = req.body;

    // Validate fields if provided
    if (class_name !== undefined && !class_name) {
      return res.status(400).json({ error: 'Class name cannot be empty' });
    }

    if (sport !== undefined) {
      const validSports: Sport[] = ['Cricket', 'Football', 'Pickleball', 'Gaming', 'Badminton', 'Party'];
      if (!validSports.includes(sport)) {
        return res.status(400).json({ error: 'Invalid sport. Must be one of: ' + validSports.join(', ') });
      }
    }

    if (days !== undefined) {
      if (!Array.isArray(days) || days.length === 0) {
        return res.status(400).json({ error: 'Days must be a non-empty array' });
      }
    }

    if (start_time !== undefined || end_time !== undefined) {
      const currentStart = start_time || coachingTimings[timingIndex].start_time;
      const currentEnd = end_time || coachingTimings[timingIndex].end_time;

      const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
      if (!timeRegex.test(currentStart) || !timeRegex.test(currentEnd)) {
        return res.status(400).json({ error: 'Invalid time format. Use HH:MM' });
      }

      if (currentStart >= currentEnd) {
        return res.status(400).json({ error: 'End time must be after start time' });
      }
    }

    // Update the timing
    const updatedTiming = {
      ...coachingTimings[timingIndex],
      ...(class_name !== undefined && { class_name }),
      ...(sport !== undefined && { sport }),
      ...(days !== undefined && { days }),
      ...(start_time !== undefined && { start_time }),
      ...(end_time !== undefined && { end_time }),
      ...(is_active !== undefined && { is_active }),
      updated_at: new Date().toISOString(),
    };

    coachingTimings[timingIndex] = updatedTiming;
    res.json(updatedTiming);
  } catch (error) {
    console.error('Error updating coaching timing:', error);
    res.status(500).json({ error: 'Failed to update coaching timing' });
  }
};

// Delete coaching timing
export const deleteCoachingTiming = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Invalid timing ID' });
    }

    const timingIndex = coachingTimings.findIndex(t => t.id === id);

    if (timingIndex === -1) {
      return res.status(404).json({ error: 'Coaching timing not found' });
    }

    const deletedTiming = coachingTimings.splice(timingIndex, 1)[0];
    res.json(deletedTiming);
  } catch (error) {
    console.error('Error deleting coaching timing:', error);
    res.status(500).json({ error: 'Failed to delete coaching timing' });
  }
};
