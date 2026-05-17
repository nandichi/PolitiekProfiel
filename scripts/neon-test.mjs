import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);
const r = await sql`SELECT COUNT(*) FROM parties`;
console.log('parties:', r[0]);
const r2 = await sql`SELECT COUNT(*) FROM tk_voting_party`;
console.log('tk_voting_party:', r2[0]);
