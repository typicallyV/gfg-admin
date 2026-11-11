import { NextRequest } from "next/server";
import { createMentor } from "@/controllers/team.controller";

export async function POST(req: NextRequest) {
  return createMentor(req);
}
