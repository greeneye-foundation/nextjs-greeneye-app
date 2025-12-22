// pages/legal/account-deletion.js

import React from "react";
import AccountDeletion from "@/components/Legal/AccountDeletion";
import { IntlProvider } from "next-intl";

export async function getStaticProps({ locale }) {
  return {
    props: {
      messages: require(`../../locales/${locale}.json`)
    }
  };
}

const AccountDeletionPage = ({ messages }) => {
  return (
    <IntlProvider messages={messages}>
      <AccountDeletion />
    </IntlProvider>
  );
};

export default AccountDeletionPage;
