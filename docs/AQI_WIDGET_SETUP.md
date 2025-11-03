# AQI Widget Setup Guide

The AQI (Air Quality Index) Widget provides real-time air quality monitoring for your website visitors, with location-based AQI data and a call-to-action to support environmental initiatives.

## Features

✅ **Real-time AQI Data** - Live air quality monitoring
✅ **Location-based** - Automatically detects user's location
✅ **Multiple Pollutants** - PM2.5, PM10, O₃, NO₂, SO₂, CO
✅ **Color-coded** - Standard AQI color scheme
✅ **Expandable Widget** - Minimal footprint, detailed when needed
✅ **Donate Integration** - "Help Improve AQI" button links to donation page
✅ **Responsive Design** - Works on all device sizes

## Data Sources

### Primary: WAQI (World Air Quality Index)
- **Website**: https://aqicn.org/
- **API Documentation**: https://aqicn.org/api/
- **Coverage**: Global (200+ countries)
- **Data Sources**: Government monitoring stations worldwide
- **Cost**: FREE (with API token)
- **Update Frequency**: Real-time (every 30 minutes)

### Alternative Sources (Future Integration)

1. **OpenWeatherMap Air Pollution API**
   - https://openweathermap.org/api/air-pollution
   - Free tier: 1,000 calls/day

2. **OpenAQ**
   - https://openaq.org/
   - Open source, government data aggregation
   - Completely free

## Setup Instructions

### Step 1: Get WAQI API Token

1. Visit https://aqicn.org/data-platform/token/
2. Fill out the registration form:
   - Name
   - Email
   - Website URL
   - Purpose (e.g., "Environmental awareness widget for NGO website")
3. You'll receive your API token via email immediately
4. The token is completely FREE

### Step 2: Add Environment Variable

1. Open (or create) `.env.local` file in your project root
2. Add your WAQI API token:

```env
NEXT_PUBLIC_WAQI_TOKEN=your_api_token_here
```

3. Restart your development server

### Step 3: Verify Installation

The AQI widget should now appear in the bottom-left corner of your website!

## Widget Behavior

### On First Load
- Requests user's geolocation permission
- If granted: Shows AQI for user's current location
- If denied: Falls back to default city (Jaipur, India)

### Compact View (Default)
- Small widget showing:
  - AQI value and color-coded badge
  - City name
  - Air quality category
  - Expand/collapse button

### Expanded View (On Click)
- Detailed pollutant breakdown
- Dominant pollutant indicator
- "Help Improve AQI" button → redirects to /donate
- Last updated timestamp
- Data source attribution

## AQI Color Scale

| AQI Range | Category | Color | Health Implications |
|-----------|----------|-------|---------------------|
| 0-50 | Good | Green | Air quality is satisfactory |
| 51-100 | Moderate | Yellow | Acceptable for most people |
| 101-150 | Unhealthy for Sensitive Groups | Orange | Sensitive groups may experience effects |
| 151-200 | Unhealthy | Red | Everyone may begin to experience effects |
| 201-300 | Very Unhealthy | Purple | Health alert: everyone may experience serious effects |
| 301+ | Hazardous | Maroon | Health warnings of emergency conditions |

## Customization

### Change Default City
Edit `components/AQIWidget.jsx`, line ~116:

```javascript
const response = await fetch(
  `https://api.waqi.info/feed/your-city/?token=${WAQI_TOKEN}`
);
```

Replace `your-city` with your preferred default city.

### Widget Position
Edit `styles/aqi-widget.css`:

```css
.aqi-widget {
    position: fixed;
    bottom: 20px;  /* Change this */
    left: 20px;    /* Change this */
    /* ... */
}
```

Available positions:
- Bottom-left: `bottom: 20px; left: 20px;`
- Bottom-right: `bottom: 20px; right: 20px;`
- Top-left: `top: 100px; left: 20px;`
- Top-right: `top: 100px; right: 20px;`

### Hide on Specific Pages

Edit `components/Layout.js`:

```javascript
import { useRouter } from 'next/router';

const Layout = ({ children, title = "GreenEye" }) => {
  const router = useRouter();
  const hideAQI = ['/admin', '/login'].includes(router.pathname);

  return (
    <>
      {/* ... */}
      {showLayout && !hideAQI && <AQIWidget />}
    </>
  );
};
```

## API Usage Limits

### WAQI Free Tier
- **Requests**: Unlimited
- **Rate Limit**: 1000 requests per minute per IP
- **Requirements**: Attribution required

The widget automatically refreshes data every 30 minutes to stay within limits.

## Troubleshooting

### Widget Not Appearing
1. Check if API token is set in `.env.local`
2. Verify token with: https://api.waqi.info/feed/beijing/?token=YOUR_TOKEN
3. Check browser console for errors
4. Make sure you restarted dev server after adding env variable

### "Demo" Mode
If you see `NEXT_PUBLIC_WAQI_TOKEN=demo` or no token:
- Widget will use WAQI's demo token
- Limited to Beijing data only
- Get your own token for full functionality

### Location Permission Issues
- Widget falls back to default city if permission denied
- Users can manually allow location in browser settings
- No location data is stored or sent to your servers

## Data Privacy

✅ **No Data Collection** - Location data is only used client-side
✅ **No Tracking** - We don't track or store user locations
✅ **GDPR Compliant** - Respects user privacy
✅ **Transparent** - Data source clearly attributed

## Advanced Configuration

### Multiple Data Sources (Fallback)

You can add OpenWeatherMap as a fallback:

1. Get OpenWeatherMap API key from https://openweathermap.org/api
2. Add to `.env.local`:
```env
NEXT_PUBLIC_OPENWEATHER_KEY=your_key_here
```

3. Modify `AQIWidget.jsx` to include fallback logic

## Support

For issues or questions:
- **WAQI API**: support@waqi.info
- **Widget Issues**: Check project GitHub issues

## License

The AQI Widget is part of the GreenEye Foundation project.
WAQI data is provided under CC BY 4.0 license with attribution.

---

**Last Updated**: November 2025
**Version**: 1.0.0
