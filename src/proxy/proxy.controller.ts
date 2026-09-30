import {
  All,
  Controller,
  Req,
  Res,
  Session,
  UnauthorizedException,
} from "@nestjs/common";
import { Request, Response } from "express";
import { ProxyService } from "./proxy.service";

@Controller()
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) { }

  @All(["lists", "lists/*path", "cards", "cards/*path", "users", "users/*path", 'auth/register',
  ])
  async proxy(
    @Req() req: Request,
    @Res() res: Response,
    @Session() session: Record<string, any>,
  ) {

    const isPublicPath = req.path === '/auth/register';

    if (!isPublicPath && !session.jwt) {
      throw new UnauthorizedException('No active session');
    }

    const { status, data } = await this.proxyService.forward(
      req.method,
      req.path,
      session.jwt,
      req.body,
      new URLSearchParams(req.query as any).toString(),
    );

    return res.status(status).json(data);
  }
}
