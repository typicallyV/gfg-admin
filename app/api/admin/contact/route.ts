import { NextRequest } from 'next/server';
import { getContacts } from "@/controllers/contact.controller";

export async function GET(req: NextRequest) {
  return getContacts(req);
}