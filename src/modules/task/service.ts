// healthService.ts
import {RepositoryInterface} from './repository';
import {CreateTaskRequestBody, UpdateTaskRequestBody, UpdateTaskBulkRequestBody, DeleteTaskBulkRequestBody} from '../primitive/request';
import Redis from 'ioredis';
import {Task} from "../primitive/model";
import {uniqueNumber} from "../../utils/utils";

export interface TaskServiceInterface {
    findTask(): Promise<Task[]>;
    detailTaskById(id: number): Promise<Task | null>
    detailTaskById(id: number): Promise<Task | null>
    registerTask(request: CreateTaskRequestBody): Promise<Task | null>
    updateTaskDetails(taskId: number, request: UpdateTaskRequestBody): Promise<Task | null>
    updateTaskBulkCompleted(request: UpdateTaskBulkRequestBody): Promise<void>
    deleteTaskBulk(request: DeleteTaskBulkRequestBody): Promise<void>
}

export class TaskService implements TaskServiceInterface {
    private repository: RepositoryInterface;
    private redisClient: Redis;

    constructor(repository: RepositoryInterface, redisClient: Redis) {
        this.repository = repository;
        this.redisClient = redisClient;
    }

    async findTask(): Promise<Task[]> {
        try {
            return await this.repository.FindTask();
        } catch (e) {
            if (e instanceof Error) {
                throw new Error(e.message);
            } else {
                throw new Error(String(e));
            }
        }
    }

    async detailTaskById(id: number): Promise<Task | null> {
        try {
            return await this.repository.DetailTask(id);
        } catch (e) {
            if (e instanceof Error) {
                throw new Error(e.message);
            } else {
                throw new Error(String(e));
            }
        }
    }

    async registerTask(request: CreateTaskRequestBody): Promise<Task | null> {
        // Initialize taskObj with request data
        const taskObj = new Task();
        taskObj.title = request.title;
        taskObj.description = request.description;
        taskObj.completed = request.completed ?? false;

        try {
            // Save the task using the repository
            return await this.repository.CreateTask(taskObj);
        } catch (e) {
            // Re-throw the error directly
            throw new Error(e instanceof Error ? e.message : String(e));
        }
    }

    async updateTaskDetails(taskId: number, request: UpdateTaskRequestBody): Promise<Task | null> {
        try {
            // Find the task by ID
            const task = await this.repository.DetailTask(taskId);
            if (!task) {
                return null;
            }

            // Update task details
            task.title = request.title && request.title.trim() !== '' ? request.title : task.title;
            task.description = request.description && request.description.trim() !== '' ? request.description : task.description;
            task.completed = request.completed !== undefined ? request.completed : task.completed;


            // Save the updated task
            return await this.repository.UpdateTaskDetail(task.id, task);
        } catch (e) {
            throw new Error(e instanceof Error ? e.message : String(e));
        }
    }

    async updateTaskBulkCompleted(request: UpdateTaskBulkRequestBody): Promise<void> {
        try {
            const taskIdUnique = uniqueNumber(request.task_id);
            // Fetch all tasks with the provided taskIds
            const tasks = await this.repository.FindTaskByIds(taskIdUnique);
            if (tasks.length === 0) {
                console.warn('No tasks found for the provided IDs.');
                return;
            }

            // Update the 'completed' field for each valid task
            tasks.forEach(task => {
                task.completed = request.completed ?? false;
            });

            // Save all updated tasks in bulk
            await this.repository.UpdateTaskBulk(tasks);
        } catch (e) {
            throw new Error(e instanceof Error ? e.message : String(e));
        }
    }

    async deleteTaskBulk(request: DeleteTaskBulkRequestBody): Promise<void> {
        try {
            const taskIdUnique = uniqueNumber(request.task_id);
            // Fetch all tasks with the provided taskIds
            const tasks = await this.repository.FindTaskByIds(taskIdUnique);
            if (tasks.length === 0) {
                console.warn('No tasks found for the provided IDs.');
                return;
            }
            // Extract only the task IDs
            const taskIds = tasks.map(task => task.id);

            // Delete all tasks in bulk
            await this.repository.DeleteTasks(taskIds);
        } catch (e) {
            throw new Error(e instanceof Error ? e.message : String(e));
        }
    }

}