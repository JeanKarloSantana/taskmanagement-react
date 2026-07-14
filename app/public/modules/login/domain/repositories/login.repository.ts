import type { LoginCredentials } from "../entities/login-credentials";
import type { LoginResult } from "../entities/login-result";

export abstract class LoginRepository {
  abstract login(credentials: LoginCredentials): Promise<LoginResult>;
}
