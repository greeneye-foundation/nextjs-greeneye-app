const BACKEND = process.env.NEXT_PUBLIC_API_BASE_URL;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const response = await fetch(`${BACKEND}/api/otp/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
}
