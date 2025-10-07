// src/Controller/authcontroller.ts
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { supabase } from '../lib/supabase.js';
import { logAudit } from '../lib/audit.js';
import 'dotenv/config';

export const listAdmins = async (_req: Request, res: Response) => {
  const { data, error } = await supabase
    .from('Admins')
    .select('Id, Name, Email, CreatedAt')

  if (error) {
    console.error(`[AUTH] Database error:`, error.message);
    return res.status(500).json({ error: error.message });
  }

  res.json({ admins: data || [] });
};

export const loginAdmin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  console.log(`[AUTH] Database query started`);
  const queryStart = Date.now();
  const { data, error } = await supabase
    .from('Admins')
    .select('Id, Name, Email, PasswordHash')
    .eq('Email', email)
    .maybeSingle();
  const queryEnd = Date.now();
  console.log(`[AUTH] Database query completed in ${queryEnd - queryStart}ms`);

  if (error) {
    console.error(`[AUTH] Database error:`, error.message);
    return res.status(500).json({ error: error.message });
  }
  if (!data) {
    console.log(`[AUTH] No user found for email: ${email}`);
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  console.log(`[AUTH] Password verification started`);
  const bcryptStart = Date.now();
  const ok = await bcrypt.compare(password, data.PasswordHash);
  const bcryptEnd = Date.now();
  console.log(`[AUTH] Password verification completed in ${bcryptEnd - bcryptStart}ms`);

  if (!ok) {
    console.log(`[AUTH] Invalid password for email: ${email}`);
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  console.log(`[AUTH] JWT token generation started`);
  const jwtStart = Date.now();
  const token = jwt.sign(
    { sub: data.Id, email: data.Email, name: data.Name },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' } // Extended to 7 days for better UX
  );
  const jwtEnd = Date.now();
  console.log(`[AUTH] JWT token generated in ${jwtEnd - jwtStart}ms`);

  console.log(`[AUTH] Audit logging started`);
  const auditStart = Date.now();
  await logAudit({
    action: 'LOGIN',
    entity: 'Admin',
    entityId: data.Id,
    actorId: data.Id,
    actorEmail: data.Email
  });
  const auditEnd = Date.now();
  console.log(`[AUTH] Audit logging completed in ${auditEnd - auditStart}ms`);

  const endTime = Date.now();
  console.log(`[AUTH] Total login time: ${endTime - queryStart}ms`);

  res.json({ token });
};
