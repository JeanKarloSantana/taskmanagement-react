import { HttpService } from "~/core/services/http.service";
import { LoginHttpRepository, LoginUseCase } from "~/public/modules/login";

const apiUrl = process.env.API_URL;

if (!apiUrl) {
  throw new Error("API_URL is required");
}

const loginRepository = new LoginHttpRepository(new HttpService(), apiUrl);

export const loginUseCase = new LoginUseCase(loginRepository);
