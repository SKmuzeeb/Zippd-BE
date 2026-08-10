import { sql } from '../db.js';

function mapProduct(row) {
  return {
    ...row,
    price_rupees: Number(row.price_rupees),
    min_order_qty: Number(row.min_order_qty),
    step: Number(row.step),
  };
}

export async function listProducts({ kiranaId } = {}) {
  const rows = kiranaId
    ? await sql`select * from products where kirana_id = ${kiranaId} order by name asc`
    : await sql`select * from products order by name asc`;

  return rows.map(mapProduct);
}

export async function getProductById(id) {
  const rows = await sql`select * from products where id = ${id}`;
  return rows[0] ? mapProduct(rows[0]) : null;
}
