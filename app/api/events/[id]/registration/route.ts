let events: any[] = [];
let registrations: any[] = [];

export async function POST(req: Request, { params }: any) {
  const body = await req.json();

  const event = events.find(e => e.id === params.id);
  if (!event)
    return Response.json({ error: "Event not found" }, { status: 404 });

  if (event.registrationStatus !== "open") {
    return Response.json({ error: "Registration closed" }, { status: 400 });
  }

  const reg = {
    id: Date.now().toString(),
    eventId: params.id,
    ...body,
  };

  registrations.push(reg);
  event.registrationsCount++;

  return Response.json(reg);
}