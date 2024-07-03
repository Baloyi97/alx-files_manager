import express from 'express';
import startServer from './libs/boot';
import injectRoutes from './routes';
import injectMiddlewares from './libs/middlewares';

/**
 * This script sets up an Express server instance, injects middleware functions and routes,
 * and starts the server.
 */
const server = express();

injectMiddlewares(server);
injectRoutes(server);
startServer(server);

export default server;
