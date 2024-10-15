const kv = await Deno.openKv();

type User = {
  username: string;
  email: string;
  sessionId: string;
  token: string;
  avatarUrl?: string;
};

export function saveUser(email: string, sessionId: string) {}

export async function getUser(sessionId: string) {
  const user = await kv.get(["site_sessions", sessionId]);

  const parsedUser = JSON.parse(user.value as string);
  const { userinfo } = parsedUser;

  // map github user info to user object

  const githubUserMap = {
    username: userinfo.login,
    email: userinfo.email,
    avatarUrl: userinfo.avatar_url,
  };

  return githubUserMap;
}
