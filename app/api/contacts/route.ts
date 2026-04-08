let contacts: any[] = [];

export async function POST(req: Request) {
  const body = await req.json();

  const contact = {
    id: Date.now().toString(),
    createdAt: new Date(),
    ...body,
  };

  contacts.push(contact);
  return Response.json(contact);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;

  const start = (page - 1) * limit;
  const data = contacts.slice(start, start + limit);

  return Response.json({
    data,
    total: contacts.length,
  });
}