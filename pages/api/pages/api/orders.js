import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'data', 'orders.json');

function readOrders() {
  try {
    if (!fs.existsSync(dataPath)) return [];
    const data = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading orders:', error);
    return [];
  }
}

function writeOrders(orders) {
  fs.writeFileSync(dataPath, JSON.stringify(orders, null, 2), 'utf8');
}

export default function handler(req, res) {
  if (req.method === 'GET') {
    const orders = readOrders();
    return res.status(200).json(orders);
  }
  if (req.method === 'POST') {
    const orders = readOrders();
    const newOrder = { id: Date.now(), ...req.body, status: 'pending', createdAt: new Date().toISOString() };
    orders.push(newOrder);
    writeOrders(orders);
    return res.status(201).json(newOrder);
  }
  if (req.method === 'PUT') {
    const orders = readOrders();
    const index = orders.findIndex(o => o.id == req.body.id);
    if (index !== -1) {
      orders[index] = { ...orders[index], ...req.body };
      writeOrders(orders);
      return res.status(200).json(orders[index]);
    }
    return res.status(404).json({ error: 'Order not found' });
  }
  if (req.method === 'DELETE') {
    const orders = readOrders();
    const filtered = orders.filter(o => o.id != req.body.id);
    writeOrders(filtered);
    return res.status(200).json({ success: true });
  }
  res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}