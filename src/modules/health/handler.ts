import { Request, Response, Router } from 'express';
import { HealthServiceInterface } from './service';

export class HealthHandler {
    private healthService: HealthServiceInterface;

    constructor(healthService: HealthServiceInterface) {
        this.healthService = healthService;
    }

    setupRoutes(router: Router): Router {
        router.get('/ping', this.ping);
        router.get('/check', this.healthCheckApi.bind(this));
        return router;
    }

    async ping(req: Request, res: Response): Promise<void> {
        res.status(200).json({
            status: "OK",
            message: "pong",
        });
    }

    async healthCheckApi(req: Request, res: Response): Promise<void> {
        try {
            const healthStatus = await this.healthService.checkUpTime();
            res.status(200).json({
                status: "OK",
                message: healthStatus,
            });
        } catch (error) {
            console.error("Health check API error:", error);
            res.status(500).json({
                status: "Error",
                message: "Something went wrong",
            });
        }
    }
}