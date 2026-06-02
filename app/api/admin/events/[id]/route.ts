import { NextRequest } from 'next/server';
import { deleteEvent, updateEvent } from "@/controllers/event.controller";

export async function PUT(req: NextRequest, { params }: any) {
  const { id } = await params;
  return updateEvent(req, { params: { id } });
}

export async function DELETE(req: NextRequest, { params }: any) {
  const { id } = await params;
  return deleteEvent(req, { params: { id } });
}
