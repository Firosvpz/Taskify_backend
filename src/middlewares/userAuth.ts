import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  userId?: string;
}

const userAuth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<any> => {
  
   const token = req.header('x-auth-token');
  if (!token)
    return res
      .status(401)
      .json({ message: "Token required for authentication" });
  try {
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as jwt.JwtPayload;
    req.userId = decodedToken.userId as string;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default userAuth;
