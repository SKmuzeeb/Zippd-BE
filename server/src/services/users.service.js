import { sql } from '../db.js';

export async function findOrCreateUserByEmail(email) {
  await sql`insert into users (email) values (${email}) on conflict (email) do nothing`;
  const rows = await sql`select id, email, created_at from users where email = ${email}`;
  return rows[0];
}

export async function getUserById(id) {
  const rows = await sql`select id, email, created_at from users where id = ${id}`;
  return rows[0] ?? null;
}

export async function getProfileById(id) {
  const rows = await sql`select * from profiles where id = ${id}`;
  return rows[0] ?? null;
}

export async function upsertProfile({ id, email }) {
  const rows = await sql`
    insert into profiles (id, email)
    values (${id}, ${email})
    on conflict (id) do update set email = excluded.email
    returning *
  `;
  return rows[0];
}

// TODO: wire up a real provider (e.g. Resend) once EMAIL_API_KEY is configured.
// Until then this stays a no-crash stub — dev mode already returns the token
// directly in the /api/auth/magic-link response, so this is just a log line.
export async function sendMagicLinkEmail(email, token) {
  if (!process.env.EMAIL_API_KEY) {
    console.log(`[magic-link] EMAIL_API_KEY not set — would send to ${email}. Token: ${token}`);
    return;
  }

  console.log(`[magic-link] EMAIL_API_KEY is set but no email provider is wired up yet — skipping send to ${email}.`);
}
