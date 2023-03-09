import "../styles/globals.css";
import { MainProvider } from "../context/MainProvider";

export default function App({ Component, pageProps }) {
  return (
    <div>
      <MainProvider>
        <Component {...pageProps} />
      </MainProvider>
    </div>
  );
}
