import "../styles/globals.css";
import { AppProps } from "next/app";
import React from "react";
import { Layout } from "src/components/Layout";
import { AuthProvider } from "src/context/AuthContext";
import { withAuth } from "src/components/withAuth";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  );
}

export default withAuth(MyApp);
