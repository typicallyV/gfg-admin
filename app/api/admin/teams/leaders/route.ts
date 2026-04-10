import { NextRequest } from "next/server";
import { createLeader } from "@/controllers/team.controller";

export async function POST(req: NextRequest) {
  return createLeader(req);
}