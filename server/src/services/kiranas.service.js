import { sql } from '../db.js';

export async function listKiranas({ city } = {}) {
  if (city) {
    return sql`
      select id, name, owner_name, address, locality, city, phone, tagline,
             hours_open, hours_close, created_at
      from kiranas
      where lower(city) = lower(${city})
      order by name asc
    `;
  }

  return sql`
    select id, name, owner_name, address, locality, city, phone, tagline,
           hours_open, hours_close, created_at
    from kiranas
    order by name asc
  `;
}

export async function getKiranaById(id) {
  const rows = await sql`select * from kiranas where id = ${id}`;
  return rows[0] ?? null;
}
