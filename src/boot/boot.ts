import RateLimiter from '../infrastructure/limiter/limiter';
import { NewDatabaseClient } from '../infrastructure/postgres/postgres';
import { RedisLib } from '../infrastructure/redis/redis';
import { HealthHandler } from '../modules/health/handler';
import { HealthService } from '../modules/health/service';
import { HealthRepository } from '../modules/health/repository';
import { TaskHandler } from '../modules/task/handler';
import { TaskService } from '../modules/task/service';
import { TaskRepository } from '../modules/task/repository';
import {parseBoolean} from "../utils/utils";
import {TaskRepositoryInMemory} from "../modules/task/repositoryInMemory";

export interface HandlerSetup {
    limiter: RateLimiter;
    healthHandler: HealthHandler;
    taskHandler: TaskHandler;
}

export async function initializeHandlers(): Promise<HandlerSetup> {
    // Initialize Redis client
    let redisLib;
    let redisClient;
    try {
        redisLib = await RedisLib.init();
        redisClient = await RedisLib.initClient();
    } catch (err) {
        console.error("Failed to initialize Redis client", err);
        process.exit(1);
    }

    // Initialize PostgreSQL client
    let dbHandler;
    try {
        dbHandler = await NewDatabaseClient();
    } catch (err) {
        console.error("Failed to initialize database client", err);
        process.exit(1);
    }


    // Setup Rate Limiter with environment variables or defaults
    const defaultRate = 100;
    const defaultInterval = 1000;
    const rate = parseInt(process.env.RATE || `${defaultRate}`);
    const interval = parseInt(process.env.INTERVAL || `${defaultInterval}`);
    const middlewareWithLimiter = new RateLimiter(rate, interval);

    // Initialize Health module
    const healthRepository = new HealthRepository(dbHandler);
    const healthService = new HealthService(healthRepository, redisClient);
    const healthHandler = new HealthHandler(healthService);

    // Initialize Task module
    let taskRepository;
    if (!parseBoolean(process.env.postgres_enabled || 'false')) {
        taskRepository = new TaskRepositoryInMemory();
    } else {
        taskRepository = new TaskRepository(dbHandler);
    }
    const taskService = new TaskService(taskRepository, redisClient);
    const taskHandler = new TaskHandler(taskService);

    return {
        limiter: middlewareWithLimiter,
        healthHandler: healthHandler,
        taskHandler: taskHandler,
    };
}
