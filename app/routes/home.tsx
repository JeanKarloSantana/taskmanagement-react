import { useEffect } from "react";
import type { Route } from "./+types/home";
import { Login } from "../public/features/login/pages/login";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  useEffect(() => {
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("dark");
  }, []);

  return <Login />;
}
