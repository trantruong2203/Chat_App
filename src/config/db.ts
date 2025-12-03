import { Pool, PoolClient, QueryResult } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
	connectionString: process.env.DATABASE_URL || undefined,
	host: process.env.DATABASE_URL ? undefined : process.env.DB_HOST,
	user: process.env.DATABASE_URL ? undefined : process.env.DB_USER,
	password: process.env.DATABASE_URL ? undefined : process.env.DB_PASSWORD,
	database: process.env.DATABASE_URL ? undefined : process.env.DB_NAME,
	ssl: { rejectUnauthorized: false },
});

// Kết nối thử để log trạng thái
pool
	.connect()
	.then((client: PoolClient) => {
		client.release();
		console.log('✅ Kết nối PostgreSQL (Neon) thành công!');
	})
	.catch((err: Error) => {
		console.error('❌ Kết nối PostgreSQL thất bại:', err);
	});

// Adapter để giữ nguyên giao diện [rows] như mysql2/promise
export const db = {
	query: (text: string, params?: any[]) => pool.query(text, params).then((res: QueryResult) => [res.rows] as any),
	pool,
};