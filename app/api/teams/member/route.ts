let members: any[] = [];

export async function POST(req: Request) {
  const body = await req.json();

  const member = { id: Date.now().toString(), ...body };
  members.push(member);

  return Response.json(member);
}