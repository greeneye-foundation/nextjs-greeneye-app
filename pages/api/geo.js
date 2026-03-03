// pages/api/geo.js
export default async function handler(req, res) {
  // Get IP address; behind proxies, check x-forwarded-for (first IP is the user's real IP)
  const forwarded = req.headers['x-forwarded-for'];
  let ip = forwarded ? forwarded.split(',')[0].trim() : req.socket?.remoteAddress || '';

  // Node socket IP fallback
  if (!ip) ip = req.socket?.remoteAddress || '';

  // If running locally, you'll get ::1 or 127.0.0.1 which is not geolocatable
  if (ip === '::1' || ip === '127.0.0.1') {
    return res.status(200).json({
      ip,
      country: "India",
      countryCode: "IN",
      city: null,
      region: "India",
      message: "Cannot geolocate localhost IP. Using India defaults. Deploy to production for real geolocation."
    });
  }

  // If the IP is IPv6 mapped (e.g. ::ffff:49.32.123.4), extract IPv4
  if (ip.startsWith('::ffff:')) {
    ip = ip.split(':').pop();
  }

  try {
    // Call ipapi.co with the resolved client IP
    const geoRes = await fetch(`https://ipapi.co/${encodeURIComponent(ip)}/json/`, {
      headers: {
        'User-Agent': 'GreenEyeApp/1.0'
      },
      cache: 'no-store',
    });

    if (!geoRes.ok) {
      throw new Error(`ipapi.co responded with ${geoRes.status}`);
    }

    const data = await geoRes.json();

    // ipapi.co fields: country (code), country_name (full), city, region/region_code
    const countryCode = data?.country || 'IN';         // default -> IN
    const countryName = data?.country_name || 'India'; // default -> India
    const city        = data?.city ?? null;
    const region      = data?.region || data?.region_code || 'India'; // default -> India

    return res.status(200).json({
      ip,
      country: countryName,
      countryCode,
      city,
      region,
    });
  } catch (error) {
    // On any failure, return India defaults (200 so UI works gracefully)
    return res.status(200).json({
      ip,
      country: "India",
      countryCode: "IN",
      city: null,
      region: "India",
      message: "Geo lookup failed. Using India defaults."
    });
  }
}
