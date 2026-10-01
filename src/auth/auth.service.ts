import { HttpService } from '@nestjs/axios';
import {
  BadGatewayException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly http: HttpService) { }

  /**
   * Authenticates against the upstream API and returns its access token.
   * @param dto Validated login credentials.
   * @returns The access token issued by the API.
   * @throws UnauthorizedException when the API rejects the credentials.
   * @throws BadGatewayException when the API is unavailable or returns no token.
   */
  async login(dto: LoginDto): Promise<string> {
    try {
      const { data } = await firstValueFrom(
        this.http.post<{ accesstoken?: string }>('/auth/login', dto),
      );

      if (!data.accesstoken) {
        throw new BadGatewayException('No token returned by auth service');
      }
      return data.accesstoken;
    } catch (error) {
      if (error instanceof BadGatewayException) throw error;

      const status = (error as { response?: { status?: number } })?.response?.status;
      if (status && status >= 400 && status < 500) {
        throw new UnauthorizedException('Invalid credentials');
      }

      throw new BadGatewayException('Auth service unavailable');
    }
  }
}
