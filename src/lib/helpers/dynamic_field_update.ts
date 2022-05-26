import db from '@/services/database';

export default async function <D>(id: string, data: D): Promise<void> {
  const field = Object.keys(data)
    .map((key, i) => `${key} = $${i + 1}`)
    .join(', ');

  const q = `
      UPDATE menus
      SET ${field}
      WHERE id = $${Object.keys(data).length + 1}
    `;
  await db.query(q, [...Object.values(data), id]);
}
