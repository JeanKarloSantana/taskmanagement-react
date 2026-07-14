import { HttpService } from "~/core/services/http.service";
import type { LoginCredentials } from "../../domain/entities/login-credentials";
import type { LoginResult } from "../../domain/entities/login-result";
import { LoginRepository } from "../../domain/repositories/login.repository";
import { loginResponseSchema } from "../contracts/login.response";
import { LoginMapper } from "../mappers/login.mapper";

const LOGIN_API_DOMAIN = "http://localhost:5071";
const LOGIN_API_PATH = "api/auth/login";

export class LoginHttpRepository extends LoginRepository {
  constructor(private readonly httpService: HttpService) {
    super();
  }

  async login(credentials: LoginCredentials): Promise<LoginResult> {
    const response: unknown = await this.httpService.post(
      LOGIN_API_DOMAIN,
      LOGIN_API_PATH,
      LoginMapper.toRequest(credentials),
    );

    return LoginMapper.toDomain(loginResponseSchema.parse(response));
  }
}
