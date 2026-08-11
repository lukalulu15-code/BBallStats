import express from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    res.status(401).json({ message: "Niste prijavljeni" });
    return;
  }
  const token = header.substring("Bearer ".length);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string);
    (req as any).user = payload;
    next();
  } catch (err) {
    res.status(401).json({ message: "Sesija je istekla, prijavite se ponovo" });
  }
};
