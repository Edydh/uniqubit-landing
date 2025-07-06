// TODO: Implement form handling logic (e.g., send to Supabase or Email)
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    res.status(200).json({ message: 'Received' });
  } else {
    res.status(405).end();
  }
}
