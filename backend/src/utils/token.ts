import jwt from "jsonwebtoken";

export const generisiToken = (korisnickoIme: string, tip: string) => {
  return jwt.sign({ korisnickoIme, tip }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
};
