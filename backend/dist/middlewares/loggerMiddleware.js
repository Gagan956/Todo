import Log from '../models/Log.js';
export const requestLogger = async (req, res, next) => {
    const start = Date.now();
    res.on('finish', async () => {
        const duration = Date.now() - start;
        if (res.statusCode >= 400) {
            await Log.create({
                level: res.statusCode >= 500 ? 'error' : 'warn',
                message: `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`,
                userId: req.user?.userId
            });
        }
    });
    next();
};
//# sourceMappingURL=loggerMiddleware.js.map