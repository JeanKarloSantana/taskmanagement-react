import NavBar from "~/shared/components/atoms/nav-bar";

export default function Login() {
  return (
    <div>
      <NavBar />
      <div className="border border-solid rounded-md w-full max-w-385 mx-auto mt-10 flex flex-row">
        <div className="bg-background-alt w-200 h-50">
          <h1 className="text-[30px] pl-20 pt-20">Master your<br></br>daily rhythm.</h1>
        </div>
        <div className="w-full h-14">
          <h1>test 2</h1>
        </div>
      </div>
    </div>
  );
}
