import { HttpService } from "~/core/services/http.service";
import { LoginHttpRepository, LoginUseCase } from "~/public/modules/login";

const loginRepository = new LoginHttpRepository(new HttpService());

export const loginUseCase = new LoginUseCase(loginRepository);
