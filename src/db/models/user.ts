import { z } from 'zod';
import db from '../schema';

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  mobile: z.string().optional(),
  role: z.enum(['user', 'admin']),
  status: z.enum(['active', 'suspended', 'pending']),
  passwordHash: z.string(),
  createdAt: z.number(),
  lastLogin: z.number().optional(),
  verifiedEmail: z.boolean(),
  verifiedMobile: z.boolean(),
  notifyEmail: z.boolean(),
  notifySms: z.boolean(),
});

export type User = z.infer<typeof userSchema>;

export const UserModel = {
  create: db.prepare(`
    INSERT INTO users (
      id, email, name, firstName, lastName, mobile, role, status,
      passwordHash, createdAt, verifiedEmail, verifiedMobile,
      notifyEmail, notifySms
    ) VALUES (
      @id, @email, @name, @firstName, @lastName, @mobile, @role, @status,
      @passwordHash, @createdAt, @verifiedEmail, @verifiedMobile,
      @notifyEmail, @notifySms
    )
  `),

  findById: db.prepare('SELECT * FROM users WHERE id = ?'),
  
  findByEmail: db.prepare('SELECT * FROM users WHERE email = ?'),
  
  updateById: db.prepare(`
    UPDATE users SET
      email = @email,
      name = @name,
      firstName = @firstName,
      lastName = @lastName,
      mobile = @mobile,
      role = @role,
      status = @status,
      verifiedEmail = @verifiedEmail,
      verifiedMobile = @verifiedMobile,
      notifyEmail = @notifyEmail,
      notifySms = @notifySms
    WHERE id = @id
  `),

  updateLastLogin: db.prepare('UPDATE users SET lastLogin = ? WHERE id = ?'),
  
  deleteById: db.prepare('DELETE FROM users WHERE id = ?'),
  
  listAll: db.prepare('SELECT * FROM users ORDER BY createdAt DESC'),
};