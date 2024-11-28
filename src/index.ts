import dotenv from 'dotenv';
import sequelize from './common/config/sequelize';
import app from './app';

dotenv.config();

const port = process.env.PORT || 3000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Unable to start the server:', error);
    process.exit(1);
  }
}

start();

