import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../database/db.connection';
import { userSchema } from '../database/schema/user.schema';
import { roleSchema } from '../database/schema/role.schema';
import { eq } from 'drizzle-orm';

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
    name: string;
  };
}

export function authMiddleware(requiredRoles?: string[]) {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
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

      // Check required roles if needed
      if (requiredRoles && !requiredRoles.includes(role.title)) {
        return res
          .status(403)
          .json({ message: 'Forbidden: You do not have permission' });
      }

      // Attach user info to the request
      req.user = {
        id: user.id,
        role: role.title, // Ex: 'admin', 'member'
        name: user.name,
      };

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized', error });
    }
  };
}
