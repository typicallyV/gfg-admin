import { NextRequest } from 'next/server';
import { updateEvent } from "@/controllers/event.controller";

export async function PUT(req: NextRequest, { params }: any) {
  const { id } = await params;
  return updateEvent(req, { params: { id } });
}
