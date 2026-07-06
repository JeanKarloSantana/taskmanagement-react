import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("public/features/landing-page/pages/home.tsx"),
  route("login", "public/features/login/pages/login.tsx"),
] satisfies RouteConfig;
