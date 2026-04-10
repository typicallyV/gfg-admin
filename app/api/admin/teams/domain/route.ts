import { NextRequest } from "next/server";
import { createDomain } from "@/controllers/team.controller";

export async function POST(req: NextRequest) {
  return createDomain(req);
}