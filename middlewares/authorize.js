import { createCustomError } from "../utils/createError.js";

export const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(createCustomError(500,'Auth middleware must be called before authorize'));
        }

        if (allowedRoles.includes(req.user.role)) {
            return next();
        }

        return next(createCustomError(403,'You dont permission to perform this action'));
    };
};