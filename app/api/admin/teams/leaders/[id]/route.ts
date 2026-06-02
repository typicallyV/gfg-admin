import { NextRequest } from "next/server";
import { getLeader, deleteLeader, updateLeader } from "@/controllers/team.controller";

export async function GET(req: NextRequest, { params }: any) {
  const { id } = await params;
  return getLeader(req, { params: { id } });
}

export async function PUT(req: NextRequest, { params }: any) {
  const { id } = await params;
  return updateLeader(req, { params: { id } });
}

export async function DELETE(req: NextRequest, { params }: any) {
  const { id } = await params;
  return deleteLeader(req, { params: { id } });
}