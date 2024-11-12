import {Request, Response, NextFunction, RequestHandler} from 'express';
import RateLimiter from '../limiter/limiter';

// Function to create the middleware using the RateLimiter
export default function rateMiddleware(limiter: RateLimiter): RequestHandler {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (limiter.allow()) {
            next();
        } else {
            res.status(429).json({ message: "Rate limit exceeded" });
        }
    };
}