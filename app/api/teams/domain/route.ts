let domains: any[] = [];

export async function POST(req: Request) {
  const body = await req.json();

  const domain = {
    id: Date.now().toString(),
    name: body.name,
    members: [],
  };

  domains.push(domain);
  return Response.json(domain);
}