// pages/legal/shipping-policy.js

import React from "react";
import ShippingPolicy from "@/components/Legal/ShippingPolicy";
import { IntlProvider } from "next-intl";

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: require(`../../locales/${locale}.json`)
    }
  };
}

const ShippingPolicyPage = ({ messages }) => {
  return (
    <IntlProvider messages={messages}>
      <ShippingPolicy />
    </IntlProvider>
  );
};

export default ShippingPolicyPage;
