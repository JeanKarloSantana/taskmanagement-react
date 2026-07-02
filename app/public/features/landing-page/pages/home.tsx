import { useContext } from "react";
import { i18nContext } from "~/core/contexts/i18n-context";
import { themeContext } from "~/core/contexts/theme-context";
import NavBar from "~/shared/components/atoms/nav-bar";

export default function Home() {
  const { setTheme } = useContext(themeContext);
  const { translation } = useContext(i18nContext);

  return (
    <div>
      <button onClick={() => setTheme((currentTheme) => currentTheme === "dark" ? "light" : "dark")}>
        {translation("landing.navBar.theme.toggle")}
      </button>
      <NavBar />
    </div>
  );
}
