import { Request, Response, Router } from 'express';
import { TaskServiceInterface } from './service';
import {setSuccessResponse,setErrorResponse} from "../../infrastructure/httplib/httplib";
import {createTaskSchema, deleteTaskBulkSchema, updateTaskBulkSchema, updateTaskSchema} from '../primitive/validation';
import {CreateTaskRequestBody, UpdateTaskRequestBody} from '../primitive/request';

export class TaskHandler {
    private taskService: TaskServiceInterface;

    constructor(taskService: TaskServiceInterface) {
        this.taskService = taskService;
    }

    setupRoutes(router: Router): Router {
        router.post('/tasks', this.createTask.bind(this));
        router.get('/tasks', this.findTask.bind(this));
        router.get('/tasks/:id', this.detailTask.bind(this));
        router.put('/tasks/:id', this.updateTaskDetail.bind(this));
        router.delete('/tasks', this.deleteTaskBulk.bind(this));
        router.put('/tasks-completed', this.updateTaskCompletedBulk.bind(this));
        return router;
    }

    async findTask(req: Request, res: Response): Promise<void> {
        // If there are no parameters, handle as a request for all tasks
        try {
            const result = await this.taskService.findTask();
            setSuccessResponse(res, 200, '', result);
        } catch (error) {
            console.error("Error getting tasks:", error);
            setErrorResponse(res, 500, error instanceof Error ? error.message : String(error), null);
        }
    }

    async detailTask(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id) || !id) {
            // If `id` is not a valid number, return a 400 response
            setErrorResponse(res, 400, 'Invalid ID Task', req.params.id);
            return;
        }
        try {
            const result = await this.taskService.detailTaskById(id);
            if (!result) {
                setErrorResponse(res, 404, 'Record not found', id);
                return;
            }
            setSuccessResponse(res, 200, 'Success get task', result);
        } catch (error) {
            console.error("Error getting task:", error);
            setErrorResponse(res, 500, error instanceof Error ? error.message : String(error), req.params.id);
        }
    }

    async createTask(req: Request, res: Response): Promise<void> {
        // Validate the request body
        const { error, value } = createTaskSchema.validate(req.body, {abortEarly: false});
        if (error) {
            setErrorResponse(res, 400, 'error, Bad Request', error)
            return;
        }

        // Assign validated request body
        const request: CreateTaskRequestBody = value;
        try {
            const result = await this.taskService.registerTask(value);
            if (!result) {
                setErrorResponse(res, 500, 'error, Something Went Wrong', request);
                return;
            }
            setSuccessResponse(res, 200, 'Success create task', result);
        } catch (error) {
            console.error("Error create task:", error);
            setErrorResponse(res, 500, error instanceof Error ? error.message : String(error), req.body);
        }
    }

    async updateTaskDetail(req: Request, res: Response): Promise<void> {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id) || !id) {
            // If `id` is not a valid number, return a 400 response
            setErrorResponse(res, 400, 'Invalid ID Task', req.params.id);
            return;
        }
        // Validate the request body
        const { error, value } = updateTaskSchema.validate(req.body, {abortEarly: false});
        if (error) {
            setErrorResponse(res, 400, 'error, Bad Request', error)
            return;
        }

        // Assign validated request body
        const request: UpdateTaskRequestBody = value;
        try {
            const result = await this.taskService.updateTaskDetails(id, value);
            if (!result) {
                setErrorResponse(res, 500, 'error, Something Went Wrong', request);
                return;
            }
            setSuccessResponse(res, 200, 'Success update task', result);
        } catch (error) {
            console.error("Error create task:", error);
            setErrorResponse(res, 500, error instanceof Error ? error.message : String(error), req.body);
        }
    }

    async updateTaskCompletedBulk(req: Request, res: Response): Promise<void> {
        // Validate the request body
        const { error, value } = updateTaskBulkSchema.validate(req.body, {abortEarly: false});
        if (error) {
            setErrorResponse(res, 400, 'error, Bad Request', error)
            return;
        }
        try {
            const result = await this.taskService.updateTaskBulkCompleted(value);
            setSuccessResponse(res, 200, 'Success update task', result);
        } catch (error) {
            console.error("Error update task:", error);
            setErrorResponse(res, 500, error instanceof Error ? error.message : String(error), req.body);
        }
    }

    async deleteTaskBulk(req: Request, res: Response): Promise<void> {
        // Validate the request body
        const { error, value } = deleteTaskBulkSchema.validate(req.body, {abortEarly: false});
        if (error) {
            setErrorResponse(res, 400, 'error, Bad Request', error)
            return;
        }
        try {
            const result = await this.taskService.deleteTaskBulk(value);
            setSuccessResponse(res, 200, 'Success delete task', result);
        } catch (error) {
            console.error("Error delete task:", error);
            setErrorResponse(res, 500, error instanceof Error ? error.message : String(error), req.body);
        }
    }

}