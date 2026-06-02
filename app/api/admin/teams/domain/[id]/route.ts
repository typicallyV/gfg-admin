import { NextRequest } from "next/server";
import { getDomain, deleteDomain, updateDomain } from "@/controllers/team.controller";

export async function GET(req: NextRequest, { params }: any) {
  const { id } = await params;
  return getDomain(req, { params: { id } });
}

export async function PUT(req: NextRequest, { params }: any) {
  const { id } = await params;
  return updateDomain(req, { params: { id } });
}

export async function DELETE(req: NextRequest, { params }: any) {
  const { id } = await params;
  return deleteDomain(req, { params: { id } });
}