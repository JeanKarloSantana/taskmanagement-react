import { createSessionStorage } from "react-router";
import {
  sessionStore,
  type SessionData,
  type SessionFlashData,
} from "./session-store.server";

const isProduction = process.env.NODE_ENV === "production";
const sessionSecret = process.env.SESSION_SECRET;

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
