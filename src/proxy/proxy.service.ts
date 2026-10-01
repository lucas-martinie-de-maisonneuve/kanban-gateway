import { HttpService } from '@nestjs/axios';
import { BadGatewayException, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProxyService {
  constructor(private readonly http: HttpService) {}

  /**
   * Sends an HTTP request to the configured API and preserves its status and response body.
   * @param method HTTP method to forward.
   * @param path Request path relative to the configured API base URL.
   * @param jwt Optional access token to send as a bearer credential.
   * @param body Optional request payload.
   * @param query Optional serialized query string, without a leading question mark.
   * @returns The upstream response status and body.
   * @throws BadGatewayException when the upstream API cannot be reached.
   */
  async forward(
    method: string,
    path: string,
    jwt?: string,
    body?: unknown,
    query?: string,
  ) {
    try {
      const response = await firstValueFrom(
        this.http.request({
          method: method,
          url: query ? `${path}?${query}` : path,
          headers: {
            'Content-Type': 'application/json',
            ...(jwt && { Authorization: `Bearer ${jwt}` }),
          },
          data: body,
          validateStatus: () => true,
        }),
      );
      return { status: response.status, data: response.data };
    } catch {
      throw new BadGatewayException('Upstream service unavailable');
    }
  }
}
