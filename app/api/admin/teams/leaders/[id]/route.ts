import { NextRequest } from "next/server";
import { deleteLeader, updateLeader } from "@/controllers/team.controller";

export async function PUT(req: NextRequest, { params }: any) {
  const { id } = await params;
  return updateLeader(req, { params: { id } });
}

export async function DELETE(req: NextRequest, { params }: any) {
  const { id } = await params;
  return deleteLeader(req, { params: { id } });
}