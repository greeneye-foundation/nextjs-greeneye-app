// pages/legal/cancellations-refunds.js

import React from "react";
import CancellationsRefunds from "@/components/Legal/CancellationsRefunds";
import { IntlProvider } from "next-intl";

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: require(`../../locales/${locale}.json`)
    }
  };
}

const CancellationsRefundsPage = ({ messages }) => {
  return (
    <IntlProvider messages={messages}>
      <CancellationsRefunds />
    </IntlProvider>
  );
};

export default CancellationsRefundsPage;
