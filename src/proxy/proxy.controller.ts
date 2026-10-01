import {
  All,
  Controller,
  Req,
  Res,
  UnauthorizedException,
} from "@nestjs/common";
import { Request, Response } from "express";
import { SessionService } from "../session/session.service";
import { ProxyService } from "./proxy.service";

const PUBLIC_PATHS = ["/auth/register"];

@Controller()
export class ProxyController {
  constructor(
    private readonly proxyService: ProxyService,
    private readonly sessionService: SessionService,
  ) {}

  /**
   * Forwards an allowed request and enforces the server-side session policy.
   * Expired or revoked sessions are removed when the upstream API responds with 401.
   */
  @All([
    "lists",
    "lists/*path",
    "cards",
    "cards/*path",
    "users",
    "users/*path",
    "auth/register",
  ])
  async proxy(@Req() req: Request, @Res() res: Response) {
    const isPublicPath = PUBLIC_PATHS.includes(req.path);
    const jwt = this.sessionService.getJwt(req.session);

    if (!isPublicPath && !jwt) {
      throw new UnauthorizedException("No active session");
    }

    const { status, data } = await this.proxyService.forward(
      req.method,
      req.path,
      isPublicPath ? undefined : jwt,
      req.body,
      new URLSearchParams(req.query as Record<string, string>).toString(),
    );

    if (status === 401 && !isPublicPath) {
      await this.sessionService.destroy(req.session);
      res.clearCookie("connect.sid");
    }

    return res.status(status).json(data);
  }
}
