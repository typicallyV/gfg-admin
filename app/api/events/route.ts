let events: any[] = [];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const status = searchParams.get("status");
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 10;
  const upcoming = searchParams.get("upcoming");

  let data = events;

  if (status) data = data.filter(e => e.registrationStatus === status);

  if (upcoming === "true") {
    const now = new Date();
    data = data.filter(e => new Date(e.startDate) > now);
  }

  const start = (page - 1) * limit;
  const paginated = data.slice(start, start + limit);

  return Response.json({
    data: paginated,
    total: data.length,
    page,
    limit,
  });
}

export async function POST(req: Request) {
  const body = await req.json();

  const event = {
    id: Date.now().toString(),
    registrationStatus: "open",
    registrationsCount: 0,
    ...body,
  };

  events.push(event);
  return Response.json(event);
}