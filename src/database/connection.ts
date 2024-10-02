import { createPool, Pool } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const db: Pool = createPool({
  host: process.env.DB_HOST as string,
  user: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_NAME as string,
});

const getConnection = async (): Promise<void> => {
  try {
    const connection = await db.getConnection();
    console.log('Connected to database');
    connection.release();
  } 
  catch (err : any) {
    console.log('Connect to database failed', err.message);
  }
};

getConnection();

export default db;
