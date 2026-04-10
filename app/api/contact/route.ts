import { NextRequest } from 'next/server';
import { createContact } from "@/controllers/contact.controller";

export async function POST(req: NextRequest) {
  return createContact(req);
}