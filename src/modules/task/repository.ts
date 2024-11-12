// healthRepository.ts
import {DataSource, FindOperator, FindOptionsUtils, In, Repository} from 'typeorm';
import {Task} from "../primitive/model";

export interface RepositoryInterface {
    CreateTask(task: Task): Promise<Task>;
    FindTask(): Promise<Task[]>;
    FindTaskByIds(taskIds: number[]): Promise<Task[]>
    DetailTask(id: number): Promise<Task | null>;
    UpdateTaskBulk(tasks: Task[]): Promise<void>;
    UpdateTaskDetail(id: number, updatedTask: Partial<Task>): Promise<Task | null>;
    DeleteTasks(taskIds: number[]): Promise<boolean>
}

export class TaskRepository implements RepositoryInterface {
    private taskRepository: Repository<Task>;

    constructor(db: DataSource) {
        this.taskRepository = db.getRepository(Task);
    }

    async CreateTask(task: Task): Promise<Task> {
        const newTask = this.taskRepository.create(task);
        return await this.taskRepository.save(newTask);
    }

    async FindTask(): Promise<Task[]> {
        return await this.taskRepository.find();
    }

    async FindTaskByIds(taskIds: number[]): Promise<Task[]> {
        return await this.taskRepository.find({
            where: {
                id: In(taskIds),
            },
        });
    }

    async DetailTask(id: number): Promise<Task | null> {
        return await this.taskRepository.findOne({ where: { id } });
    }

    async UpdateTaskBulk(tasks: Task[]): Promise<void> {
        await this.taskRepository.save(tasks);
    }

    async UpdateTaskDetail(id: number, updatedTask: Partial<Task>): Promise<Task | null> {
        await this.taskRepository.update(id, updatedTask);
        return await this.taskRepository.findOne({ where: { id } });
    }

    async DeleteTasks(taskIds: number[]): Promise<boolean> {
        try {
            // Use 'In' to delete multiple tasks at once
            const result = await this.taskRepository.delete({
                id: In(taskIds),
            });

            // Return true if at least one task was deleted
            return result.affected !== 0;
        } catch (e) {
            throw new Error(e instanceof Error ? e.message : String(e));
        }
    }
}
