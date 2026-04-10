import { NextRequest } from "next/server";
import { deleteDomain, updateDomain } from "@/controllers/team.controller";

export async function PUT(req: NextRequest, { params }: any) {
  const { id } = await params;
  return updateDomain(req, { params: { id } });
}

export async function DELETE(req: NextRequest, { params }: any) {
  const { id } = await params;
  return deleteDomain(req, { params: { id } });
}