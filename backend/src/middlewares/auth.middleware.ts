import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../database/db.connection';
import { userSchema } from '../database/schema/user.schema';
import { roleSchema } from '../database/schema/role.schema';
import { eq } from 'drizzle-orm';

const JWT_SECRET = process.env.JWT_SECRET as string;

// Extend Express Request interface to include 'user'
declare global {
  namespace Express {
    interface User {
      id: string;
      role: string;
    }
    interface Request {
      user: User;
    }
  }
}

export async function authMiddleware(req: Request, res: Response, next: NextFunction){
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: Token missing' });
      }

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

      if (!decoded.id) {
        return res.status(401).json({ message: 'Invalid token' });
      }

      const [user] = await db
        .select()
        .from(userSchema)
        .where(eq(userSchema.id, decoded.id));

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Fetch role
      const [role] = await db
        .select()
        .from(roleSchema)
        .where(eq(roleSchema.id, user.role_id));

      if (!role) {
        return res.status(404).json({ message: 'User role not found' });
      }

      // Attach user info to the request
      req.user = {
        id: user.id,
        role: role.title, // Ex: 'admin', 'member'
      };

      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized', error });
    }
  };

