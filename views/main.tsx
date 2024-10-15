import { isDev } from "../src/utils/helpers.ts";

export function Main({ isLoggedIn }: { isLoggedIn: boolean }) {
  console.log(isDev);
  return (
    <html lang='en'>
      <head>
        <meta charset='UTF-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <link href='styles.css' rel='stylesheet' />
        {isDev && <script defer src='./hmr.js'></script>}
        <script
          src='https://unpkg.com/htmx.org@2.0.3'
          integrity='sha384-0895/pl2MU10Hqc6jd4RvrthNlDiE9U1tWmX7WRESftEDRosgxNsQG/Ze9YMRzHq'
          crossorigin='anonymous'></script>

        <title>Marketplace</title>
      </head>
      <body class=''>
        <h1 class='text-3xl text-center'>Marketplace</h1>
      </body>
      {isLoggedIn ? (
        <Logout />
      ) : (
        <div class='flex gap-2 items-center'>
          <Login />
        </div>
      )}
    </html>
  );
}

export function Login() {
  return (
    <form action='/sign-in' method='post'>
      <button class='btn'>Sign In with Github</button>
    </form>
  );
}

export function Logout() {
  return (
    <form action='/sign-out' method='get'>
      <button class='btn'>Sign Out</button>
    </form>
  );
}
