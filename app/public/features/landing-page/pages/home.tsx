import { useContext } from "react";
import { i18nContext } from "~/core/i18n-context";
import { themeContext } from "~/core/theme-context";
import NavBar from "~/shared/components/atoms/nav-bar";

export default function Home() {
  const { setTheme } = useContext(themeContext);
  const { translation } = useContext(i18nContext);

  return (
    <div>
      <button onClick={() => setTheme((currentTheme) => currentTheme === "dark" ? "light" : "dark")}>
        {translation("theme.toggle")}
      </button>
      <NavBar />
    </div>
  );
}
