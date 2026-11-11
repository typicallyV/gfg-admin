import { getMentors } from "@/controllers/team.controller";

export async function GET() {
  return getMentors();
}
