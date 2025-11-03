import Head from 'next/head';
import { useState } from 'react';

import Navbar from './Navbar';
import Footer from './Footer';
import AQIWidget from './AQIWidget';

const Layout = ({ children, title = "GreenEye" }) => {
  const [showLayout, setShowLayout] = useState(true);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {showLayout && <Navbar />}
      <main>{children}</main>
      {showLayout && <Footer />}
      {showLayout && <AQIWidget />}
    </>
  );
};

export default Layout;
