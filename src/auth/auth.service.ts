import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios from "axios";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(private readonly configService: ConfigService) {}

  async login(dto: LoginDto): Promise<string> {
    const apiUrl = this.configService.get<string>("NESTJS_API_URL");

    try {
      const response = await axios.post(`${apiUrl}/auth/login`, dto);
      return response.data.accesstoken;
    } catch {
      throw new UnauthorizedException("Invalid credentials");
    }
  }
}
