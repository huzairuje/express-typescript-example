import { RepositoryInterface } from "./repository";
import { Task } from "../primitive/model";

let tasks: Task[] = [];

export class TaskRepositoryInMemory implements RepositoryInterface {
    constructor() {}

    async CreateTask(task: Task): Promise<Task> {
        task.id = tasks.length + 1;
        tasks.push(task);
        return Promise.resolve(task);
    }

    async FindTask(): Promise<Task[]> {
        return Promise.resolve(tasks);
    }

    async FindTaskByIds(taskIds: number[]): Promise<Task[]> {
        // Filter tasks to only those whose ids are in the taskIds array
        const foundTasks = tasks.filter((task) => taskIds.includes(task.id));
        return Promise.resolve(foundTasks);
    }

    async DetailTask(id: number): Promise<Task | null> {
        const task = tasks.find((t) => t.id === id) || null;
        return Promise.resolve(task);
    }

    async UpdateTaskBulk(updatedTasks: Task[]): Promise<void> {
        updatedTasks.forEach((updatedTask) => {
            const index = tasks.findIndex((t) => t.id === updatedTask.id);
            if (index !== -1) {
                tasks[index] = { ...tasks[index], ...updatedTask };
            }
        });
        return Promise.resolve();
    }

    async UpdateTaskDetail(id: number, updatedTask: Partial<Task>): Promise<Task | null> {
        const task = tasks.find((t) => t.id === id) || null;
        if (!task) return Promise.resolve(null);

        Object.assign(task, updatedTask);
        return Promise.resolve(task);
    }

    async DeleteTask(id: number): Promise<boolean> {
        const index = tasks.findIndex((t) => t.id === id);
        if (index === -1) return Promise.resolve(false);
        tasks.splice(index, 1);
        return Promise.resolve(true);
    }

    async DeleteTasks(taskIds: number[]): Promise<boolean> {
        // Filter out tasks whose ids are not in the taskIds array
        const initialLength = tasks.length;
        tasks = tasks.filter((task) => !taskIds.includes(task.id));

        // Check if any tasks were deleted
        const deletedCount = initialLength - tasks.length;
        return Promise.resolve(deletedCount > 0);
    }
}
