import { NextRequest } from 'next/server';
import { getEventById } from "@/controllers/event.controller";

export async function GET(req: NextRequest, { params }: any) {
  const { id } = await params;
  return getEventById(req, { params: { id } });
}