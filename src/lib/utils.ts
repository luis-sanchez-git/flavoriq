import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 *
 * Eg. const [error, user] = await catchError(getUser(1))
 *
 * @param promise
 * @returns [Error, data]
 */
export function catchError<T>(
    promise: Promise<T>,
): Promise<[undefined, T] | [Error]> {
    return promise
        .then((data) => [undefined, data] as [undefined, T])
        .catch((e) => [e])
}
