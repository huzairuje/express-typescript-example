import express, {Application, Router} from 'express';
import rateLimitMiddleware from '../infrastructure/middleware/rateMiddleware';
import { HandlerSetup } from '../boot/boot';
import notFoundHandler from "../infrastructure/middleware/notFoundMiddleware";

export class HandlerRouter {
    private setup: HandlerSetup;

    constructor(setup: HandlerSetup) {
        this.setup = setup;
    }

    public routerWithMiddleware(): Application {
        const app = express();

        //use limiter
        app.use(rateLimitMiddleware(this.setup.limiter));

        // Grouping API routes under /api
        const apiRouter = Router();

        // Define /api/v1 prefix for version 1
        const v1Router = Router();

        // Define health module routes for /api/v1
        v1Router.use('/health', this.setup.healthHandler.setupRoutes(v1Router));

        // Define tasks module routes for /api/v1
        v1Router.use('', this.setup.taskHandler.setupRoutes(v1Router));

        // Attach /api/v1 routes to apiRouter
        apiRouter.use('/v1', v1Router);

        // Attach apiRouter to the main app
        app.use('/api', apiRouter);

        //use not found middleware
        app.use(notFoundHandler());

        return app;
    }
}
