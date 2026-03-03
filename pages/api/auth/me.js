const COOKIE_NAME = 'auth_token';
const BACKEND = process.env.NEXT_PUBLIC_API_BASE_URL;

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const token = req.cookies[COOKIE_NAME];
  if (!token) return res.status(401).json({ message: 'Not authenticated' });

  try {
    const response = await fetch(`${BACKEND}/api/users/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const user = await response.json();
    return res.status(200).json({ user, token });
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
}
