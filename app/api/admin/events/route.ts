import { NextRequest } from 'next/server';
import { createEvent } from "@/controllers/event.controller";

export async function POST(req: NextRequest) {
  return createEvent(req);
}