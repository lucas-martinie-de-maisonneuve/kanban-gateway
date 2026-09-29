import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import axios, { AxiosRequestConfig, Method } from "axios";

@Injectable()
export class ProxyService {
  constructor(private readonly configService: ConfigService) {}

  async forward(
    method: string,
    path: string,
    jwt: string,
    body?: any,
    query?: string,
  ) {
    const apiUrl = this.configService.get<string>("NESTJS_API_URL");
    let targetUrl = `${apiUrl}${path}`;
    if (query) targetUrl += `?${query}`;

    const config: AxiosRequestConfig = {
      method: method as Method,
      url: targetUrl,
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
      data: body,
      validateStatus: () => true,
    };

    const response = await axios(config);
    return { status: response.status, data: response.data };
  }
}
