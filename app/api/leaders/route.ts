import { NextRequest } from "next/server";
import { getLeaders } from "@/controllers/team.controller";

export async function GET(req: NextRequest) {
  return getLeaders(req);
}