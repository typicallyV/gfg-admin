import { getLeaders } from "@/controllers/team.controller";

export async function GET() {
  return getLeaders();
}