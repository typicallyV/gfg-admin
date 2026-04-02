let events: any[] = [];

export async function GET(req: Request, { params }: any) {
  const event = events.find(e => e.id === params.id);
  if (!event) return Response.json({ error: "Not found" }, { status: 404 });
  return Response.json(event);
}

export async function PUT(req: Request, { params }: any) {
  const body = await req.json();
  const index = events.findIndex(e => e.id === params.id);

  if (index === -1)
    return Response.json({ error: "Not found" }, { status: 404 });

  events[index] = { ...events[index], ...body };
  return Response.json(events[index]);
}

export async function DELETE(req: Request, { params }: any) {
  events = events.filter(e => e.id !== params.id);
  return Response.json({ success: true });
}