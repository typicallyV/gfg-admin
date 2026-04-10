import { NextRequest } from "next/server";
import { createMember } from "@/controllers/team.controller";

export async function POST(req: NextRequest) {
  return createMember(req);
}