import Head from 'next/head';
import Script from 'next/script';

import 'tailwindcss/tailwind.css';
import '@ionic/react/css/core.css';
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

import '../styles/global.css';
import '../styles/variables.css';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover"
        ></meta>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="description" content="Note taking app" />
        <meta name="keywords" content="Webapp" />
        <title>Noties</title>

        <link rel="manifest" href="/manifest.json" />
        <link
            href="/icons/favicon-16x16.png"
            rel="icon"
            type="image/png"
            sizes="16x16"
        />
        <link
            href="/icons/favicon-32x32.png"
            rel="icon"
            type="image/png"
            sizes="32x32"
        />
        <meta name="theme-color" content="#FFFF00" />
      </Head>
      <Component {...pageProps} />
      <Script src="https://unpkg.com/ionicons@5.2.3/dist/ionicons.js"></Script>
    </>
  );
}

export default MyApp;
