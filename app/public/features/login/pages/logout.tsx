import { redirect } from "react-router";
import { destroyUserSession } from "~/core/auth/session.server";
import type { Route } from "./+types/logout";

export function loader() {
  return redirect("/");
}

export async function action({ request }: Route.ActionArgs) {
  return destroyUserSession(request);
}

export default function Logout() {
  return null;
}
