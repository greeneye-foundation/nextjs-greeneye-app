export const metadata = {
  title: {
    default: 'GREENEYE | Plant Trees & Support Sustainability',
    template: '%s | GREENEYE',
  },
  description: 'GEYE INNOVATION FOUNDATION, branded as GREENEYE — making the planet greener through community-driven tree plantation, sustainability programs, and environmental care in Jaipur, India.',
  metadataBase: new URL('https://greeneye.foundation'),
  openGraph: {
    type: 'website',
    siteName: 'GREENEYE',
    title: 'GREENEYE | Plant Trees & Support Sustainability',
    description: 'GEYE INNOVATION FOUNDATION, branded as GREENEYE — making the planet greener through community-driven tree plantation and environmental care.',
    url: 'https://greeneye.foundation',
    images: [{ url: '/assets/GreenLandscape.png', width: 1200, height: 630, alt: 'GREENEYE - Plant Trees & Support Sustainability' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@greeneye_org',
    title: 'GREENEYE | Plant Trees & Support Sustainability',
    description: 'Making the planet greener through community-driven tree plantation and environmental care.',
    images: ['/assets/GreenLandscape.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
