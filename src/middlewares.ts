import { query, validationResult } from "express-validator"
import type { NextFunction, Request, Response } from "express";

export const validateAndSanitizeQueryString = (queryString: string) => [
    query(queryString)
        .trim()
        .escape()
        .isString()
        .notEmpty()
        .withMessage("queryString is required."),

    // Check for validation errors
    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        next();
    }
];
