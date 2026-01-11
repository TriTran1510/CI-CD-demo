import { checkDBHealth } from '../config/database.js';

export const getHealth = async (req, res) => {
  const dbHealth = await checkDBHealth();
  
  res.status(200).json({
    status: 'ok',
    message: 'Server is running',
    database: dbHealth ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
};