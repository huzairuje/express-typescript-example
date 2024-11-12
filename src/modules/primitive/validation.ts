import Joi from 'joi';
import {
    CreateTaskRequestBody,
    DeleteTaskBulkRequestBody,
    UpdateTaskBulkRequestBody,
    UpdateTaskRequestBody
} from "./request";

// Define the Joi schema based on the interface
export const createTaskSchema = Joi.object<CreateTaskRequestBody>({
    title: Joi.string().required(),
    description: Joi.string().required(),
    completed: Joi.boolean().optional(),
});

export const updateTaskSchema = Joi.object<UpdateTaskRequestBody>({
    title: Joi.string(),
    description: Joi.string(),
    completed: Joi.boolean(),
});

export const updateTaskBulkSchema = Joi.object<UpdateTaskBulkRequestBody>({
    task_id: Joi.array().required(),
    completed: Joi.boolean(),
});

export const deleteTaskBulkSchema = Joi.object<DeleteTaskBulkRequestBody>({
    task_id: Joi.array().required(),
});