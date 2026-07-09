import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import eyeIcon from "~/assets/icons/eye.svg";
import Input from "~/shared/components/atoms/input";
import InputError from "~/shared/components/atoms/input-error";
import Label from "~/shared/components/atoms/label";
import NavBar from "~/shared/components/atoms/nav-bar";
import SubmitButton from "~/shared/components/atoms/submit-button";
import { emailValidation, passwordValidation } from "~/shared/validations/auth-validations";

type Inputs = {
  email: string;
  password: string;
};

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();
  const [showPassword, setShowPassword] = useState(false);

  const tooglePassword = () => {
    setShowPassword(() => !showPassword);
  }
  
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  return (
    <div>
      <NavBar />
      <div className="w-full max-w-385 mx-auto mt-10 flex flex-row">
        <div className="border-x border-solid rounded-md border-title bg-background-alt w-200">
          <h1 className="text-title-alt font-bold text-[50px] pl-20 pt-20 mr-8 m-0 leading-none">Master your</h1>
          <h1 className="text-title-secondary-alt font-bold text-[50px] pl-20 mr-8 m-0 leading-none">daily rhythm.</h1>
          <p className="text-paragraph-alt text-[20px] pl-20 pt-20 mr-12">Turn scattered tasks into a clear plan, so you always know what needs your attention next.</p>
        </div>
        <div className="w-full bg-background-secondary flex justify-center">
          <div className="w-full max-w-200 pt-18">
            <h1 className="text-title font-bold text-[50px]">Welcome to Spica</h1>
            <p className="text-paragraph text-[20px]">Enter your access credentials</p>
            <form className="pt-10" onSubmit={handleSubmit(onSubmit)}>
              <Label text="EMAIL ADDRESS" />
              <Input placeholder="example@outlook.com" hasError={Boolean(errors.email)} {...register("email", emailValidation)} />
              {errors.email && (<InputError error={errors.email.message} />)}
              <Label text="PASSWORD" />
              <Input
                type={!showPassword ? "password" : "text"}
                placeholder="password"
                hasError={Boolean(errors.password)}
                rightIconButton={
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="flex h-8 w-8 cursor-pointer items-center justify-center text-paragraph"
                    onClick={tooglePassword}
                  >
                    <img className="h-5 w-5" src={eyeIcon} alt="show-password" aria-hidden="true" />
                  </button>
                }
                {...register("password", passwordValidation)}
              />
              {errors.password && (<InputError error={errors.password.message} />)}
              <SubmitButton />
              <div className="flex flex-row justify-center pt-4">
                <p className="text-title-secondary pt-1 pr-4 text-end">Forgot password?</p>
                <p className="text-title text-end text-[20px]">|</p>
                <p className="text-title-secondary pt-1 pl-4 text-end">Create an account</p>
              </div>              
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
