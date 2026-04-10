import { NextRequest } from 'next/server';
import { logoutAdmin } from "@/controllers/auth.controller";

export async function POST(req: NextRequest) {
  return logoutAdmin(req);
}