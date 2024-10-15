import { Hono } from "@hono/hono";
import { Main } from "../views/main.tsx";
import { serveStatic } from "@hono/hono/deno";
import { watchHandler } from "./hmr.ts";
import { getGitHubUser } from "./utils/auth/github.ts";
import {
  getSessionId,
  handleCallback,
  protectedRoute,
  signIn,
  signOut,
} from "./utils/auth/index.ts";
import TopSecret from "../views/(protected)/top-secret.tsx";
import { getUser } from "./utils/auth/user.ts";
import { logger } from "@hono/hono/logger";
const kv = await Deno.openKv();

const app = new Hono();

app.use("*", logger());

let count = 0;

app.get("/", async (c) => {
  count++;
  const sessionId = await getSessionId(c.req.raw);
  if (sessionId) {
    const oauthSession = kv.list({ prefix: ["site_sessions"] });
    for await (const { key, value } of oauthSession) {
      console.log("key", key);
      console.log("value", value);
    }
  }
  console.log("sessionId from main", sessionId);
  return c.html(<Main isLoggedIn={sessionId !== undefined} />);
});

// app.get('/sessions', async (c) => {
//   const keys = await kv.list([]);
//   const sessions = await Promise.all(keys.map(async (key) => {
//     const value = await kv.get(key);
//     return { key, value };
//   }));
//   return c.json(sessions);
// });

app.post("/sign-in", async (c) => {
  return await signIn(c.req.raw);
});

app.get("/github/callback", async (c) => {
  const { response, sessionId, tokens } = await handleCallback(c.req.raw);
  console.log("sessionId", sessionId);
  console.log("tokens", tokens);
  const userinfo = await getGitHubUser(tokens.accessToken);
  console.log("userinfo", userinfo);

  // set session
  if (sessionId) {
    await kv.set(["site_sessions", sessionId], JSON.stringify({ userinfo }));
  }

  return response;
});

app.get("/sign-out", (c) => {
  return signOut(c.req.raw);
});

app.get("/protected", async (c) => {
  const sessionId = await protectedRoute(c.req.raw);
  // get github user info
  if (!sessionId || typeof sessionId !== "string") {
    return c.redirect("/sign-in");
  }

  const user = await getUser(sessionId);

  return c.html(<TopSecret username={user.username} />);
});

// hmr
app.get("/hmr", watchHandler);

// serve static files
app.use("/*", serveStatic({ root: "./public" }));

Deno.serve(app.fetch);
