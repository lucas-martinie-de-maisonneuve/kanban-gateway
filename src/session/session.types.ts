import "express-session";

declare module "express-session" {
  interface SessionData {
    /** Access token kept server-side for authenticated upstream requests. */
    jwt?: string;
  }
}
