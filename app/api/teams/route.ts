let domains: any[] = [];

export async function GET(req: Request) {
  const domain = new URL(req.url).searchParams.get("domain");

  let data = domains;
  if (domain) data = data.filter(d => d.name === domain);

  return Response.json(data);
}