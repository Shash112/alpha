import { newDb } from 'pg-mem';

async function test() {
  try {
    const db = newDb();
    db.public.registerFunction({
      name: 'gen_random_uuid',
      implementation: () => '11111111-1111-1111-1111-111111111111'
    });
    db.public.registerFunction({
      name: 'version',
      implementation: () => 'PostgreSQL 14.0'
    });
    
    const client = db.adapters.createPg();
    const pool = new client.Pool();
    const res = await pool.query('SELECT 1 as num, gen_random_uuid() as id');
    console.log('PG MEM TEST SUCCESS:', res.rows);
  } catch (err) {
    console.error('PG MEM TEST ERROR:', err);
  }
}

test();
