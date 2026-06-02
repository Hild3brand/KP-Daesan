import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Token tidak ada",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    console.log("DECODED TOKEN:", decoded);

    req.userId = decoded.id;
    req.roleId = decoded.role_id;

    next();

  } catch (err) {
    console.error(err);

    return res.status(401).json({
      message: "Token tidak valid",
    });
  }
};