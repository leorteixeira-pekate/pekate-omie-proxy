export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { endpoint, body } = req.body;

  if (!endpoint || !body) {
    return res.status(400).json({ error: 'Missing endpoint or body' });
  }

  const OMIE_BASE = 'https://app.omie.com.br/api/v1/';
  if (!endpoint.startsWith(OMIE_BASE)) {
    return res.status(403).json({ error: 'Only Omie API endpoints are allowed' });
  }

  try {
    const omieResponse = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await omieResponse.json();
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ error: 'Proxy error: ' + error.message });
  }
}
