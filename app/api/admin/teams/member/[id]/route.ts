import { NextRequest } from "next/server";
import { getMember, deleteMember, updateMember } from "@/controllers/team.controller";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return getMember(req, { params: { id } });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return updateMember(req, { params: { id } });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return deleteMember(req, { params: { id } });
}