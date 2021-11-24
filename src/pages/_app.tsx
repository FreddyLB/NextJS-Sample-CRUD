import "../styles/globals.css";
import { AppProps } from "next/app";
import { ConfirmDialogProvider } from "src/context/ConfirmDialogContext";
import React from "react";
import { Layout } from "src/components/Layout";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ConfirmDialogProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ConfirmDialogProvider>
  );
}

export default MyApp;
