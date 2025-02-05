export class AppError extends Error {
    constructor(
        message: string,
        public code: string,
        public statusCode: number = 400,
        public details?: unknown,
    ) {
        super(message)
        this.name = 'AppError'
    }
}

export class AuthError extends AppError {
    constructor(message: string = 'Authentication required') {
        super(message, 'AUTH_ERROR', 401)
    }
}

export class NotFoundError extends AppError {
    constructor(resource: string) {
        super(`${resource} not found`, 'NOT_FOUND', 404)
    }
}
