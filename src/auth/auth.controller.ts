import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Session,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { Request } from "express";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginDto, @Session() session: Record<string, any>) {
    const token = await this.authService.login(dto);
    session.jwt = token;
    return { message: "Login successful" };
  }

  @Post("logout")
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Req() req: Request) {
    req.session.destroy(() => {});
  }
}
