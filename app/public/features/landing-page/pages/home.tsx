import { useContext } from "react";
import { useNavigate } from "react-router";
import taskHeroBrand from "~/assets/images/task-hero-brand.png";
import { i18nContext } from "~/core/contexts/i18n-context";
import { themeContext } from "~/core/contexts/theme-context";
import NavBar from "~/shared/components/atoms/nav-bar";

export default function Home() {
  const { setTheme } = useContext(themeContext);
  const { translation } = useContext(i18nContext);
  const navigate = useNavigate();

  return (
    <div>
      <button
        onClick={() => setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"))}
      >
        {translation("landing.navBar.theme.toggle")}
      </button>
      <NavBar />
      <div className="flex w-full flex-row justify-center">
        <div className="flex w-full max-w-400 flex-row items-center gap-10">
          <div className="flex-1 text-center">
            <h1 className="text-title text-[40px]">Productivity at the speed of thought.</h1>
            <h2 className="mx-auto max-w-158 text-title-secondary text-[20px]">
              Spica organizes your energy, not just your tasks. High-performance workspace for
              modern creators.
            </h2>
            <button onClick={() => navigate('/login')} className="hover:text-highlight bg-button text-button-text cursor-pointer rounded-lg w-full max-w-158 mt-4 h-14">
              Get Started
            </button>
          </div>
          <div className="flex-1">
            <img
              className="w-full"
              src={taskHeroBrand}
              alt="Spica task management dashboard preview"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
