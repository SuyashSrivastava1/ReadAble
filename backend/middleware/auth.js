import jwt from "jsonwebtoken";

const getTokenFromHeader = (req) => {
  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.slice(7);
};

export const requireAuth = (req, _res, next) => {
  const token = getTokenFromHeader(req);
  if (!token) {
    const error = new Error("Authentication required");
    error.statusCode = 401;
    return next(error);
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.sub, email: payload.email };
    return next();
  } catch (_error) {
    const error = new Error("Invalid or expired token");
    error.statusCode = 401;
    return next(error);
  }
};

export const optionalAuth = (req, _res, next) => {
  const token = getTokenFromHeader(req);
  if (!token) {
    return next();
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.sub, email: payload.email };
  } catch (_error) {
    // Ignore invalid token for optional auth routes.
  }
  return next();
};
