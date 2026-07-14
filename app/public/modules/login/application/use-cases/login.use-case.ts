import { LoginCredentials } from "../../domain/entities/login-credentials";
import type { LoginResult } from "../../domain/entities/login-result";
import type { LoginRepository } from "../../domain/repositories/login.repository";

export class LoginUseCase {
  constructor(private readonly loginRepository: LoginRepository) {}

  execute(email: string, password: string): Promise<LoginResult> {
    return this.loginRepository.login(new LoginCredentials(email, password));
  }
}
