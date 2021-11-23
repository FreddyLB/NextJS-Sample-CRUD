import "../styles/globals.css";
import { AppProps } from "next/app";
import { ConfirmDialogProvider } from "src/context/ConfirmDialogContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ConfirmDialogProvider>
      <Component {...pageProps} />
    </ConfirmDialogProvider>
  );
}

export default MyApp;
