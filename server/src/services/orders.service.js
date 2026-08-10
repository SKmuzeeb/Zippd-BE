import { sql, pool } from '../db.js';
import { generateOrderId } from '../lib/generateOrderId.js';

function mapOrder(row) {
  return {
    ...row,
    total: Number(row.total),
  };
}

function mapItem(row) {
  return {
    ...row,
    price_rupees: Number(row.price_rupees),
    quantity: Number(row.quantity),
  };
}

export async function createOrder({ userId, kiranaId, pickupSlot, total, paymentMethod, items }) {
  const orderId = generateOrderId();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const orderResult = await client.query(
      `insert into orders (id, user_id, kirana_id, pickup_slot, total, payment_method)
       values ($1, $2, $3, $4, $5, $6)
       returning *`,
      [orderId, userId ?? null, kiranaId, pickupSlot, total, paymentMethod]
    );

    const itemRows = [];
    for (const item of items) {
      const itemResult = await client.query(
        `insert into order_items (order_id, product_id, name, description, price_rupees, unit, quantity)
         values ($1, $2, $3, $4, $5, $6, $7)
         returning *`,
        [orderId, item.productId ?? null, item.name, item.description ?? null, item.price_rupees, item.unit, item.quantity]
      );
      itemRows.push(itemResult.rows[0]);
    }

    await client.query('COMMIT');

    return {
      ...mapOrder(orderResult.rows[0]),
      order_items: itemRows.map(mapItem),
    };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function listOrdersForUser(userId) {
  const orders = await sql`
    select * from orders where user_id = ${userId} order by created_at desc
  `;

  if (orders.length === 0) {
    return [];
  }

  const orderIds = orders.map((order) => order.id);
  const items = await sql`
    select * from order_items where order_id = any(${orderIds}::text[])
  `;

  return orders.map((order) => ({
    ...mapOrder(order),
    order_items: items.filter((item) => item.order_id === order.id).map(mapItem),
  }));
}

export async function getOrderById(id) {
  const rows = await sql`select * from orders where id = ${id}`;
  if (rows.length === 0) {
    return null;
  }

  const items = await sql`select * from order_items where order_id = ${id}`;

  return {
    ...mapOrder(rows[0]),
    order_items: items.map(mapItem),
  };
}

export async function updateOrderStatus(id, status) {
  const rows = await sql`
    update orders set status = ${status} where id = ${id} returning *
  `;
  return rows[0] ? mapOrder(rows[0]) : null;
}
