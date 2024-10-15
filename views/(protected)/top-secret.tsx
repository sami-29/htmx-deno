import { isDev } from "../../src/utils/helpers.ts";

export default function TopSecret({ username }: { username: string }) {
  return (
    <html lang='en'>
      <head>
        <meta charset='UTF-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <link href='styles.css' rel='stylesheet' />
        {isDev && <script defer src='/hmr.js'></script>}
        <script
          src='https://unpkg.com/htmx.org@2.0.3'
          integrity='sha384-0895/pl2MU10Hqc6jd4RvrthNlDiE9U1tWmX7WRESftEDRosgxNsQG/Ze9YMRzHq'
          crossorigin='anonymous'></script>
        <title>Htmx + Deno | Protected page</title>
      </head>
      <body class='bg-blue-200 m-4'>
        <h1 class='text-3xl text-center'>Welcome {username}!</h1>
      </body>
    </html>
  );
}
