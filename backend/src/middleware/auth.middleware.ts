import * as jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export class AuthMiddleware {
  static async authenticate(req: Request, res: Response, next: NextFunction) {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return next("No token provided (Login is necessary)");
    }
    try {
      const decodedToken = await this.verifyToken(token);
      req.body.user = decodedToken;
      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid token" });
    }
  }

  static async verifyToken(token: string) {
    try {
      return jwt.verify(token, "SECRET_KEY");
    } catch (e) {
      throw new Error("Invalid token");
    }
  }
}
