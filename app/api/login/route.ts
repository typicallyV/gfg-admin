export async function POST(req: Request) {
  const { username, password } = await req.json();

  if (username === "admin" && password === "admin") {
    return Response.json({ success: true });
  }

  return Response.json({ error: "Invalid credentials" }, { status: 401 });
}