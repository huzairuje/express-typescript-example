import {Request, Response, NextFunction, RequestHandler} from 'express';

// Middleware to handle "Not Found" routes
export default function notFoundHandler(): RequestHandler {
    return (req: Request, res: Response, next: NextFunction): void => {
        res.status(404).json({ message: "Not found Routes or Page" });
    };
}