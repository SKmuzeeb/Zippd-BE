import { sql } from '../db.js';

export async function listFavoriteProductIds(userId) {
  const rows = await sql`
    select product_id from favorites where user_id = ${userId} order by created_at desc
  `;
  return rows.map((row) => row.product_id);
}

export async function addFavorite(userId, productId) {
  await sql`
    insert into favorites (user_id, product_id)
    values (${userId}, ${productId})
    on conflict (user_id, product_id) do nothing
  `;
}

export async function removeFavorite(userId, productId) {
  await sql`
    delete from favorites where user_id = ${userId} and product_id = ${productId}
  `;
}
