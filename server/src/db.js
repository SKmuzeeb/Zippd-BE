import 'dotenv/config';
import { neon, Pool } from '@neondatabase/serverless';

const { DATABASE_URL } = process.env;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// HTTP tagged-template client — use for all single-statement queries.
export const sql = neon(DATABASE_URL);

// Pool with real BEGIN/COMMIT/ROLLBACK support — use only where a transaction is needed.
export const pool = new Pool({ connectionString: DATABASE_URL });
