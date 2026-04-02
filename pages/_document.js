// pages/_document.js
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document({ __NEXT_DATA__ }) {
  const locale = __NEXT_DATA__?.locale || 'en';

  return (
    <Html lang={locale}>
      <Head>
        {/* Favicon */}
        <link rel="icon" href="/GreenEyeLogo.ico" />

        {/* Google Fonts Preconnect for Performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Google Fonts — Instrument Serif (headings) + DM Sans (body) + legacy fallbacks */}
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&family=Montserrat:wght@400;500;600;700;800&family=Open+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />

        {/* Font Awesome */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />

        {/* Theme */}
        <meta name="theme-color" content="#000000" />
        {/* Facebook Domain Verification */}
        <meta name="facebook-domain-verification" content="iy6g39r9edjzoymmqatbhwym5o10js" />

        {/* Meta Pixel Script Loader */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
            `,
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
         {/* NoScript Image Pixel */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1115975143739370&ev=PageView&noscript=1"
          />
        </noscript>
      </body>
    </Html>
  );
}
