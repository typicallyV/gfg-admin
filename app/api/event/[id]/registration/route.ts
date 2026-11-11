import { NextRequest } from 'next/server';
import { registerForEvent } from "@/controllers/event.controller";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return registerForEvent(req, { params: { id } });
}