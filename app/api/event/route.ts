import { NextRequest } from 'next/server';
import { getEvents } from "@/controllers/event.controller";

export async function GET(req: NextRequest) {
  return getEvents(req);
}