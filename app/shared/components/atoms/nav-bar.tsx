import { useContext } from "react";
import logoDark from "~/assets/icons/brand-dark.png";
import logoLight from "~/assets/icons/brand-light.png";
import { i18nContext } from "~/core/contexts/i18n-context";
import { themeContext } from "~/core/contexts/theme-context";

export default function NavBar() {
  const { theme } = useContext(themeContext);
  const { translation } = useContext(i18nContext);
  const logo = theme === "light" ? logoLight : logoDark;

  return (
    <section className="flex h-16 justify-center bg-background-alt text-title-alt">
      <nav className="flex h-16 w-full max-w-400 items-center justify-between px-8">
        <div className="flex items-center gap-2">
          <img className="w-12" src={logo} alt="SPICA logo" />
          <h1 className="text-xl font-semibold">SPICA</h1>
        </div>

        <div className="flex items-center gap-10 text-sm font-medium">
          <a className="hover:text-highlight-alt" href="/">{translation("landing.navBar.navHome")}</a>
          <a className="hover:text-highlight-alt" href="/pricing">{translation("landing.navBar.navPricing")}</a>
          <a className="hover:text-highlight-alt" href="/about">{translation("landing.navBar.navAbout")}</a>
        </div>

        <div className="flex items-center gap-5 text-sm font-medium">
          <a className="hover:text-highlight-alt" href="/login">{translation("landing.navBar.navLogin")}</a>
          <a className="rounded-md bg-title-alt px-4 py-2 text-background-alt hover:bg-highlight-alt" href="/signup">
            {translation("landing.navBar.navSignup")}
          </a>
        </div>
      </nav>
    </section>
  );
}
