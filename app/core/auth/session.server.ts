import { createSessionStorage, redirect } from "react-router";
import { sessionStore, type SessionData, type SessionFlashData } from "./session-store.server";

const isProduction = process.env.NODE_ENV === "production";
const sessionSecret = process.env.SESSION_SECRET;
const sessionMaxAge = 60 * 60 * 8;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET is required");
}

export const { getSession, commitSession, destroySession } = createSessionStorage<
  SessionData,
  SessionFlashData
>({
  cookie: {
    name: isProduction ? "__Host-session" : "session",
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: sessionMaxAge,
    secrets: [sessionSecret],
  },

  createData(data, expires) {
    return sessionStore.create(data, expires);
  },

  readData(sessionId) {
    return sessionStore.find(sessionId);
  },

  updateData(sessionId, data, expires) {
    return sessionStore.update(sessionId, data, expires);
  },

  deleteData(sessionId) {
    return sessionStore.delete(sessionId);
  },
});

export async function getAccessToken(request: Request): Promise<string | null> {
  const session = await getSession(request.headers.get("Cookie"));
  const accessToken = session.get("accessToken");
  return typeof accessToken === "string" && accessToken.length > 0 ? accessToken : null;
}

export async function requireAccessToken(request: Request): Promise<string> {
  const accessToken = await getAccessToken(request);

  if (!accessToken) {
    throw redirect("/login");
  }

  return accessToken;
}

export async function createUserSession(request: Request, accessToken: string, redirectTo: string) {
  const currentSession = await getSession(request.headers.get("Cookie"));

  if (currentSession.id) {
    await destroySession(currentSession);
  }

  const session = await getSession();
  session.set("accessToken", accessToken);

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export async function destroyUserSession(request: Request, redirectTo = "/login") {
  const session = await getSession(request.headers.get("Cookie"));

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}
