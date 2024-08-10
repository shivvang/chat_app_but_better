import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_Token;
  if (!token) return res.status(403).send("You are not authenticated");

  jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
    if (err) return res.status(403).send("Token is invalid");
    req.userId = payload.userId;
    next();
  });
};
