import { createGitHubOAuthConfig, createHelpers } from "@deno/kv-oauth";

const oauthConfig = createGitHubOAuthConfig({
  scope: ["email"],
});
export const { signIn, handleCallback, getSessionId, signOut } =
  createHelpers(oauthConfig);

export async function protectedRoute(req: Request) {
  const sessionId = await getSessionId(req);
  if (!sessionId) {
    return Response.redirect(new URL("/sign-in", req.url));
  }
  return sessionId;
}
