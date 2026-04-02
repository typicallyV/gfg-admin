let leaders: any[] = [];

export async function PUT(req: Request, { params }: any) {
  const body = await req.json();
  const leader = leaders.find(l => l.id === params.id);

  if (!leader)
    return Response.json({ error: "Not found" }, { status: 404 });

  Object.assign(leader, body);
  return Response.json(leader);
}

export async function DELETE(req: Request, { params }: any) {
  leaders = leaders.filter(l => l.id !== params.id);
  return Response.json({ success: true });
}