import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  userId?: string;
}

const userAuth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<any> => {
  
  const authHeader = req.header('Authorization'); 
  const token = authHeader && authHeader.split(' ')[1]; 
  // console.log('token',token)
  
  
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
    console.log('req.userId',req.userId);
    
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default userAuth;
