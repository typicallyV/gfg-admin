let domains: any[] = [];

export async function PUT(req: Request, { params }: any) {
  const body = await req.json();
  const domain = domains.find(d => d.id === params.id);

  if (!domain)
    return Response.json({ error: "Not found" }, { status: 404 });

  Object.assign(domain, body);
  return Response.json(domain);
}

export async function DELETE(req: Request, { params }: any) {
  domains = domains.filter(d => d.id !== params.id);
  return Response.json({ success: true });
}