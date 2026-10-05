import app from './app.js';
import { connectDB } from './config/db.js';

let isConnected = false;

export default async (req, res) => {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
  return app(req, res);
};
