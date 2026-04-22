const express = require('express');
const helmet = require('helmet');

const config = require('./config');
const corsMiddleware = require('./config/cors');
const routes = require('./routes');
const {
    multerErrorHandler,
    notFoundHandler,
    globalErrorHandler
} = require('./middleware/errorHandler');

const app = express();

app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal']);

app.use(helmet());
app.use(corsMiddleware);
app.use(express.json({ limit: config.body.limit }));
app.use(express.urlencoded({ extended: true, limit: config.body.limit }));

app.use('/api', routes);

app.use(multerErrorHandler);
app.use(notFoundHandler);
app.use(globalErrorHandler);

module.exports = app;
