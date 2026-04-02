let leaders: any[] = [];

export async function POST(req: Request) {
  const body = await req.json();

  const leader = { id: Date.now().toString(), ...body };
  leaders.push(leader);

  return Response.json(leader);
}