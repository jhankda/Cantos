class DBerror extends Error {
    constructor(statusCode, message, originalError = null) {
        super(message);
        this.statusCode = statusCode;
        this.originalError = originalError;
    }
}

export { DBerror };
