import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  Session,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { Request, Response } from "express";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto, @Session() session: Record<string, any>) {
    const token = await this.authService.login(dto);
    session.jwt = token;
    return { message: "Login successful" };
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    req.session.destroy(() => { });
    res.clearCookie('connect.sid');
  }
}
