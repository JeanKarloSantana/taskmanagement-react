import type { LoginCredentials } from "../../domain/entities/login-credentials";
import { LoginResult } from "../../domain/entities/login-result";
import type { LoginRequest } from "../contracts/login.request";
import type { LoginResponse } from "../contracts/login.response";

export class LoginMapper {
  static toRequest(credentials: LoginCredentials): LoginRequest {
    return {
      email: credentials.email,
      password: credentials.password,
    };
  }

  static toDomain(response: LoginResponse): LoginResult {
    return new LoginResult(response);
  }
}
