import { NextRequest } from "next/server";
import { getMentor, deleteMentor, updateMentor } from "@/controllers/team.controller";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return getMentor(req, { params: { id } });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return updateMentor(req, { params: { id } });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return deleteMentor(req, { params: { id } });
}
