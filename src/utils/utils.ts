export function parseBoolean(value: string): boolean {
    return value.toLowerCase() === 'true';
}

export function uniqueNumber(numbers: number[]): number[] {
    return [...new Set(numbers)];
}