import type { FlashSessionData } from "react-router";

export type SessionData = {
  accessToken: string;
  userId?: string;
};

export type SessionFlashData = {
  error: string;
};

type StoredSessionData = FlashSessionData<SessionData, SessionFlashData>;

type StoredSession = {
  data: StoredSessionData;
  expires?: Date;
};

class InMemorySessionStore {
  private readonly sessions = new Map<string, StoredSession>();

  async create(data: StoredSessionData, expires?: Date): Promise<string> {
    const sessionId = crypto.randomUUID();

    this.sessions.set(sessionId, {
      data: { ...data },
      expires,
    });

    return sessionId;
  }

  async find(sessionId: string): Promise<StoredSessionData | null> {
    const storedSession = this.sessions.get(sessionId);

    if (!storedSession) {
      return null;
    }

    if (storedSession.expires && storedSession.expires.getTime() <= Date.now()) {
      this.sessions.delete(sessionId);
      return null;
    }

    return { ...storedSession.data };
  }

  async update(sessionId: string, data: StoredSessionData, expires?: Date): Promise<void> {
    this.sessions.set(sessionId, {
      data: { ...data },
      expires,
    });
  }

  async delete(sessionId: string): Promise<void> {
    this.sessions.delete(sessionId);
  }
}

export const sessionStore = new InMemorySessionStore();
