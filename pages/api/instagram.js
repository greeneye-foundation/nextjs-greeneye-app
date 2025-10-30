export default async function handler(req, res) {
  const IG_USER_ID = process.env.IG_USER_ID;
  const IG_ACCESS_TOKEN = process.env.IG_ACCESS_TOKEN;
  const IG_MEDIA_LIMIT = process.env.IG_MEDIA_LIMIT || "12";

  if (!IG_USER_ID || !IG_ACCESS_TOKEN) {
    return res.status(500).json({ error: "Missing IG env vars" });
  }

  const fields = [
    "id","caption","media_type","media_product_type",
    "media_url","thumbnail_url","permalink","timestamp",
    "children{media_type,media_url,thumbnail_url}"
  ].join(",");

  const url = `https://graph.facebook.com/v21.0/${IG_USER_ID}/media` +
              `?fields=${encodeURIComponent(fields)}` +
              `&limit=${IG_MEDIA_LIMIT}` +
              `&access_token=${IG_ACCESS_TOKEN}`;

  try {
    const r = await fetch(url);
    const json = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: json.error || "IG error" });
    res.setHeader("Cache-Control", "s-maxage=900, stale-while-revalidate=86400");
    return res.status(200).json({ items: json.data || [] });
  } catch (e) {
    return res.status(500).json({ error: "Instagram fetch failed" });
  }
}
