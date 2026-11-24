// Vercel's file-system router maps /api/* to this explicit Node handler.
// Keep this as a concrete function export instead of re-exporting the local
// development server's default export.
import { handleApiRequest } from '../src/api-handler.js';

export default async function handler(req, res) {
  return handleApiRequest(req, res);
}
