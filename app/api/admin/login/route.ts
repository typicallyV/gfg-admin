import { NextRequest } from 'next/server';
import { loginAdmin } from "@/controllers/auth.controller";

export async function POST(req: NextRequest) {
  return loginAdmin(req);
}