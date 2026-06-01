import { NextRequest } from 'next/server';
import { checkEmailRole } from "@/controllers/auth.controller";

export async function POST(req: NextRequest) {
  return checkEmailRole(req);
}
