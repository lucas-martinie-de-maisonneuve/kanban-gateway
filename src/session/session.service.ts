import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Session, SessionData } from "express-session";

type AppSession = Session & Partial<SessionData>;

@Injectable()
export class SessionService {
  constructor(private readonly jwtService: JwtService) {}

  /** Stores the JWT and aligns the session cookie lifetime with its expiration claim. */
  setJwt(session: AppSession, token: string): void {
    session.jwt = token;

    const payload = this.jwtService.decode<{ exp?: number } | null>(token);
    if (payload?.exp) {
      session.cookie.maxAge = payload.exp * 1000 - Date.now();
    }
  }

  /** Returns the JWT stored in the session, if the session is authenticated. */
  getJwt(session: AppSession): string | undefined {
    return session.jwt;
  }

  /**
   * Removes the session from its backing store.
   * @returns A promise that resolves after the session has been destroyed.
   */
  destroy(session: AppSession): Promise<void> {
    return new Promise((resolve, reject) =>
      session.destroy((err) => (err ? reject(err) : resolve())),
    );
  }
}
