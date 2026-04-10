import { NextRequest } from 'next/server';
import { getTeams } from "@/controllers/team.controller";

export async function GET(req: NextRequest) {
  return getTeams(req);
}