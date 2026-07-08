import { useForm, type SubmitHandler } from "react-hook-form";
import Input from "~/shared/components/atoms/input";
import InputError from "~/shared/components/atoms/input-error";
import Label from "~/shared/components/atoms/label";
import NavBar from "~/shared/components/atoms/nav-bar";
import { emailValidation, passwordValidation } from "~/shared/validations/auth-validations";

type Inputs = {
  email: string;
  password: string;
};

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  return (
    <div>
      <NavBar />
      <div className="border border-solid rounded-md w-full max-w-385 mx-auto mt-10 flex flex-row">
        <div className="bg-background-alt w-200 h-120">
          <h1 className="text-title-alt font-bold text-[50px] pl-20 pt-20 mr-8 m-0 leading-none">Master your</h1>
          <h1 className="text-title-secondary-alt font-bold text-[50px] pl-20 mr-8 m-0 leading-none">daily rhythm.</h1>
          <p className="text-paragraph-alt text-[20px] pl-20 pt-20 mr-8">Turn scattered tasks into a clear plan, so you always know what needs your attention next.</p>
        </div>
        <div className="w-full border border-solid flex justify-center">
          <div className="w-full max-w-200 pt-18">
            <h1 className="text-title font-bold text-[50px]">Welcome to Spica</h1>
            <p className="text-paragraph text-[20px]">Enter your access credentials</p>
            <form className="pt-10" onSubmit={handleSubmit(onSubmit)}>
              <Label text="EMAIL ADDRESS" />
              <Input placeholder="email" hasError={Boolean(errors.email)} {...register("email", emailValidation)} />
              {errors.email && (<InputError error={errors.email.message} />)}
              <Label text="PASSWORD" />
              <Input placeholder="password" hasError={Boolean(errors.password)} {...register("password", passwordValidation)} />
              {errors.password && (<InputError error={errors.password.message} />)}
              <input type="submit" />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
