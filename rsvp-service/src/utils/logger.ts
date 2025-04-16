class Logger {
    /**
     * Logs an informational message.
     * @param message - The message to log.
     */
    info(message: string): void {
        console.log(`INFO: ${message}`);
    }

    /**
     * Logs an error message.
     * @param message - The message to log.
     */
    error(message: string): void {
        console.error(`ERROR: ${message}`);
    }
}

export default Logger;