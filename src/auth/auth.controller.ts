import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from "@nestjs/common";
import { Request, Response } from "express";
import { SessionService } from "../session/session.service";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly sessionService: SessionService,
  ) {}

  /** Authenticates credentials and stores the returned JWT in the server-side session. */
  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto, @Req() req: Request) {
    const token = await this.authService.login(dto);
    this.sessionService.setJwt(req.session, token);
    return { message: "Login successful" };
  }

  /** Destroys the current session and clears its browser cookie. */
  @Post("logout")
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    await this.sessionService.destroy(req.session);
    res.clearCookie("connect.sid");
  }
}
