const app = require('./src/app');
const config = require('./src/config');
const logger = require('./src/utils/logger');
const database = require('./src/config/database');
const { verifyTransporter } = require('./src/config/email');

async function bootstrap() {
    if (database.isEnabled()) {
        try {
            await database.connect();
        } catch (err) {
            logger.error('Impossibile connettersi a MongoDB:', err.message);
            // l\'app continua a funzionare senza DB
        }
    }

    verifyTransporter();

    const server = app.listen(config.port, '0.0.0.0', () => {
        logger.success(`Server avviato sulla porta ${config.port} (${config.env})`);
        logger.info(`Health check:         http://0.0.0.0:${config.port}/api/health`);
        logger.info(`Endpoint preventivi:  http://0.0.0.0:${config.port}/api/preventivo`);
        logger.info(`Endpoint recensioni:  http://0.0.0.0:${config.port}/api/reviews`);
    });

    const shutdown = async signal => {
        logger.info(`Ricevuto ${signal}, chiusura in corso...`);
        server.close(async () => {
            await database.disconnect();
            logger.success('Server chiuso correttamente');
            process.exit(0);
        });
        setTimeout(() => {
            logger.error('Shutdown forzato dopo 10s');
            process.exit(1);
        }, 10000).unref();
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('unhandledRejection', reason => logger.error('Unhandled rejection:', reason));
    process.on('uncaughtException', err => logger.error('Uncaught exception:', err));
}

bootstrap();
