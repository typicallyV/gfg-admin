import { logoutAdmin } from "@/controllers/auth.controller";

export async function POST() {
  return logoutAdmin();
}