import dbConnect, { createTest } from "@/lib/db";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET() {
  try {
    await dbConnect();
    const connectionState = mongoose.connection.readyState;
    return NextResponse.json({ status: "ok", connectionState }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Connection failed" }, { status: 500 });
  }
}
