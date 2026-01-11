import dotenv from 'dotenv';
import createApp from './src/app.js';

dotenv.config();

const PORT = process.env.PORT;

// Khởi tạo app và start server
createApp()
  .then((app) => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log('='.repeat(50));
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
      console.log(`🔗 Local: http://localhost:${PORT}`);
      console.log(`🔗 API Health: http://localhost:${PORT}/api/health`);
      console.log('='.repeat(50));
    });
  })
  .catch((error) => {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  });