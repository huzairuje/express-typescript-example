// healthService.ts
import {RepositoryInterface} from './repository';
import {HealthResponse} from '../primitive/response';
import Redis from 'ioredis';

export interface HealthServiceInterface {
    checkUpTime(): Promise<HealthResponse>;
}

export class HealthService implements HealthServiceInterface {
    private repository: RepositoryInterface;
    private redisClient: Redis;

    constructor(repository: RepositoryInterface, redisClient: Redis) {
        this.repository = repository;
        this.redisClient = redisClient;
    }

    async checkUpTime(): Promise<HealthResponse> {
        let dbStatus = 'healthy';
        let redisStatus = 'healthy';

        try {
            await this.repository.checkUpTimeDB();
        } catch (err) {
            console.error("Database uptime check failed:", err);
            dbStatus = 'unhealthy';
        }

        try {
            await this.redisClient.ping();
        } catch (err) {
            console.error("Redis uptime check failed:", err);
            redisStatus = 'unhealthy';
        }

        return {
            redis: redisStatus,
            db: dbStatus
        };
    }
}