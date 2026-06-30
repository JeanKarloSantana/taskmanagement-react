import logoLight from "~/assets/icons/brand-light.png";

export default function NavBar() {
  return (
    <section className="flex h-16 justify-center bg-background-alt text-title-alt">
      <nav className="flex h-16 w-full max-w-400 items-center justify-between px-8">
        <div className="flex items-center gap-2">
          <img className="w-12" src={logoLight} alt="SPICA logo" />
          <h1 className="text-xl font-semibold">SPICA</h1>
        </div>

        <div className="flex items-center gap-10 text-sm font-medium">
          <a className="hover:text-highlight-alt" href="/">Home</a>
          <a className="hover:text-highlight-alt" href="/pricing">Pricing</a>
          <a className="hover:text-highlight-alt" href="/about">About</a>
        </div>

        <div className="flex items-center gap-5 text-sm font-medium">
          <a className="hover:text-highlight-alt" href="/login">Log in</a>
          <a className="rounded-md bg-title-alt px-4 py-2 text-background-alt hover:bg-highlight-alt" href="/signup">
            SignUp
          </a>
        </div>
      </nav>
    </section>
  );
}
