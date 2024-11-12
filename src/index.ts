import { initializeHandlers } from './boot/boot';
import { HandlerRouter } from './router/router';
import dotenv from 'dotenv';
import 'reflect-metadata';

//initiate dotenv config
dotenv.config();

(async () => {
    // Initiate handler and routes apps
    const initHandler = await initializeHandlers();
    const handlerRouter = new HandlerRouter(initHandler);
    const app = handlerRouter.routerWithMiddleware();

    const port = process.env.port || 3000;
    const host = process.env.host || 'localhost';

    // Start the server
    const server = app.listen(port, () => {
        console.log(`Server running at http://${host}:${port}`);
    });

    // Graceful shutdown
    const shutdown = () => {
        console.log('Shutting down server...');
        server.close(err => {
            if (err) {
                console.error('Error during shutdown:', err);
                process.exit(1);
            }
            console.log('Server closed gracefully');
            process.exit(0);
        });
    };

    // Capture termination signals
    process.on('SIGINT', shutdown); // Ctrl+C
    process.on('SIGTERM', shutdown); // Termination signal
})();
