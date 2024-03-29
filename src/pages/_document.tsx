import { randomBytes } from "crypto";

import { Head, Html, Main, NextScript } from "next/document";

const Document = () => {
  const nonce = randomBytes(256).toString("base64");
  const csp = `object-src 'none'; base-uri 'none'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https: http: 'nonce-${nonce}' 'strict-dynamic'`;

  return (
    <Html lang="ja">
      <Head nonce={nonce}>
        <meta httpEquiv="Content-Security-Policy" content={csp} />
      </Head>
      <body>
        <Main />
        <NextScript nonce={nonce} />
      </body>
    </Html>
  );
};

export default Document;
