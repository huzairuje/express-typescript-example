import { Response } from 'express';
import * as http from "node:http";

interface DefaultResponse<T = any, E = any> {
    status: string;
    code: number;
    message: string;
    data: T;
    dataError?: E;
}


// Default pagination response structure
interface DefaultPaginationResponse<T = any> {
    status: string;
    code: number;
    message: string;
    page: number;
    size: number;
    totalCount: number;
    totalPages: number;
    data: T;
}

// Utility function to get HTTP status text
function getStatusText(code: number): string {
    return http.STATUS_CODES[code] || 'Unknown Status';
}

// Set success response
export function setSuccessResponse<T>(res: Response, code: number, message: string, data: T): void {
    const response: DefaultResponse<T> = {
        status: getStatusText(code),
        code: code,
        message: message,
        data: data,
        dataError: null,
    };
    res.status(code).json(response);
}

// Set pagination response
export function setPaginationResponse<T>(
    res: Response,
    code: number,
    message: string,
    data: T,
    totalCount: number,
    page: number,
    size: number
): void {
    const totalPages = Math.ceil(totalCount / size);
    const response: DefaultPaginationResponse<T> = {
        status: getStatusText(code),
        code: code,
        message: message,
        page: page,
        size: size,
        totalCount: totalCount,
        totalPages: totalPages,
        data: data,
    };
    res.status(code).json(response);
}

// Set error response
export function setErrorResponse<T>(res: Response, code: number, message: string, dataError: T): void {
    const response: DefaultResponse<null, T> = {
        status: getStatusText(code),
        code: code,
        message: message,
        data: null,
        dataError: dataError,
    };
    res.status(code).json(response);
}

// Set custom response
export function setCustomResponse<T, E>(
    res: Response,
    code: number,
    message: string,
    data: T,
    dataError: E
): void {
    const response: DefaultResponse<T> = {
        status: getStatusText(code),
        code: code,
        message: message,
        data: data,
        dataError: dataError,
    };
    res.status(code).json(response);
}
