import { serialize } from 'cookie';

const COOKIE_NAME = 'auth_token';
const BACKEND = process.env.NEXT_PUBLIC_API_BASE_URL;

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: '/',
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const response = await fetch(`${BACKEND}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.setHeader('Set-Cookie', serialize(COOKIE_NAME, data.token, cookieOptions));

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
}
