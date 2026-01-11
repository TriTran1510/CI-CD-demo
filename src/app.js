import express from 'express';
import bodyParser from 'body-parser';
import { connectDB } from './config/database.js';
import routes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

const createApp = async () => {
  const app = express();

  // Middleware
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // Log tất cả requests
  app.use((req, res, next) => {
    console.log(`📨 ${req.method} ${req.url}`);
    next();
  });

  // Connect to database
  await connectDB();

  // Root route
  app.get('/', (req, res) => {
    res.json({ message: 'Server is running' });
  });

  // API Routes
  app.use('/api', routes);

  // 404 handler
  app.use((req, res) => {
    console.log(`❌ 404: ${req.method} ${req.url}`);
    res.status(404).json({ error: 'Route not found', path: req.url });
  });

  // Error handler
  app.use(errorHandler);

  return app;
};

export default createApp;