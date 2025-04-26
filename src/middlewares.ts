import { query, validationResult } from "express-validator"
import type { NextFunction, Request, Response } from "express";

export const validateAndSanitizeQueryString = (queryStrings: string[]) => [
    ...queryStrings.map((param) =>
        query(param)
            .optional({ nullable: true })
            .trim()
            .escape()
            .isString()
            .withMessage(`${param} is malformed`)
    ),


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
