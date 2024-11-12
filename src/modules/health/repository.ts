// healthRepository.ts
import { DataSource } from 'typeorm';

export interface RepositoryInterface {
    checkUpTimeDB(): Promise<void>;
}

export class HealthRepository implements RepositoryInterface {
    private db: DataSource;

    constructor(db: DataSource) {
        this.db = db;
    }

    async checkUpTimeDB(): Promise<void> {
        try {
            const queryRunner = this.db.createQueryRunner();
            await queryRunner.connect(); // Establishes a connection to verify DB health
            await queryRunner.release(); // Releases the connection back to the pool
        } catch (error) {
            throw new Error(`Database check failed: ${error}`);
        }
    }
}
