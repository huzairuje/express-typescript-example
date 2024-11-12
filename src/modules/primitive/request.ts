// Define the request body interface
export interface CreateTaskRequestBody {
    title: string;
    description: string;
    completed?: boolean;
}

export interface UpdateTaskRequestBody {
    title?: string;
    description?: string;
    completed?: boolean;
}

export interface UpdateTaskBulkRequestBody {
    task_id: number[];
    completed?: boolean;
}

export interface DeleteTaskBulkRequestBody {
    task_id: number[];
}