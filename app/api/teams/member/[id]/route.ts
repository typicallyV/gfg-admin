let members: any[] = [];

export async function PUT(req: Request, { params }: any) {
  const body = await req.json();
  const member = members.find(m => m.id === params.id);

  if (!member)
    return Response.json({ error: "Not found" }, { status: 404 });

  Object.assign(member, body);
  return Response.json(member);
}

export async function DELETE(req: Request, { params }: any) {
  members = members.filter(m => m.id !== params.id);
  return Response.json({ success: true });
}